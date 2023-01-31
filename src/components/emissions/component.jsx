import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Container, Typography, CircularProgress, Slider } from '@mui/material';
import {
	AppCurrentVisits,
	AppWebsiteVisits,
	AppWidgetSummary,
	AppCurrentSubject,
	AppConversionRates,
} from '../../sections/@dashboard/app';
import { fetchDisasters, fetchEmissions } from "../../api/api";
import { sumBy, sortBy, reverse, min, max, slice, uniqBy } from 'lodash';

const FILLS = ['solid'];
// const FILLS = ['gradient', 'solid', 'pattern', 'image'];

const getUnique = (arr, comp) => [...new Set(arr.map(x => x[comp]))];
const generateList = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const getRandomElement = (list) => list[Math.floor(Math.random() * list.length)];
const getRandomColor = () => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

export const Loading = () => {
	return (
		<Box sx={{ display: 'flex' }}>
			<CircularProgress sx={{
				margin: 'auto',
			}} />
		</Box>
	);
}

const MIN_DISTANCE = 10; // min years to show
const PICK_TOP = 5; // top n disasters to show
const DECAY_VALUE = 0; // decay value for each year
const PICK_TOP_COUNTRIES = 10; // top n countries to show

const Emissions = (props) => {
	const theme = useTheme();

	const [loading, setLoading] = useState(true);
	const [totalEmissions, setTotalEmissions] = useState([]);
	const [emissions, setEmissions] = useState([]);
	const [disasters, setDisasters] = useState([]);
	const [years, setYears] = useState([]);
	const [yearRange, setYearRange] = useState([]);

	useEffect(() => {
		(async () => {
			const _disasters = await fetchDisasters();
			const _emissions = await fetchEmissions();
			const _years = getUnique(_emissions, "year");
			const max_year = max(_years);
			const min_year = min(_years) + parseInt((max_year - min(_years)) / 2);

			debugger

			setTotalEmissions(_emissions);
			setDisasters(_disasters);
			setEmissions(_emissions);
			setYears(_years);
			setYearRange([min_year, max_year]);

			setLoading(false);
		})();
	}, []);

	const marks = [
		{
			value: min(years),
			label: min(years),
		},
		{
			value: min(years) + 40,
			label: "After first 40 years",
		},
		{
			value: max(years) - 30,
			label: "Last 30 years",
		},
		{
			value: max(years),
			label: max(years),
		},
	]

	const onSliderChange = (e, newValue, activeThumb) => {
		if (!Array.isArray(newValue)) { return; }
		const min_year = min(years);
		const max_year = max(years);
		let _min_year = yearRange[0];
		let _max_year = yearRange[1];

		if (newValue[1] - newValue[0] < MIN_DISTANCE) {
			if (activeThumb === 0) {
				const clamped = Math.min(newValue[0], max_year - MIN_DISTANCE);
				_min_year = clamped;
				_max_year = clamped + MIN_DISTANCE;
			} else {
				const clamped = Math.max(newValue[1], min_year + MIN_DISTANCE);
				_min_year = clamped - MIN_DISTANCE;
				_max_year = clamped;
			}
		} else {
			_min_year = newValue[0];
			_max_year = newValue[1];
		}

		_min_year = _min_year < min_year ? min_year : _min_year;
		_max_year = _max_year > max_year ? max_year : _max_year;
		const _emissions = totalEmissions.filter((emissions) => emissions.year >= _min_year && emissions.year <= _max_year);
		setEmissions(_emissions);
		setYearRange([_min_year, _max_year]);
	};

	const total_MTCO2e = Number(sumBy(emissions, "emission_value")) || 0;
	const affected_countries = getUnique(emissions, "country")?.length || 0;

	const display_years = generateList(yearRange[0], yearRange[1]);
	const sectors = getUnique(emissions, "sector");

	let sector_count = sectors.map((sector) => {
		return {
			name: sector,
			data: emissions.filter((emission) => emission.sector === sector).map(({ emission_value, year }) => ({ emission_value, year })),
		}
	});

	sector_count = sector_count.map(sector => {
		return {
			...sector,
			data: sortBy(sector.data, (r) => r.year),
		}
	});

	let top_sectors = reverse(sortBy(sector_count, (r) => r.data.length));

	top_sectors = top_sectors.map((sector) => {
		let result = {};
		sector.data.forEach(({ year, emission_value }) => {
			if (!result[year]) { result[year] = 0; }
			result[year] += emission_value;
		})
		let last_year = 0;
		display_years.forEach((year) => {
			if (!result[year]) { result[year] = Number(last_year * DECAY_VALUE); }
			last_year = result[year];
		})
		Object.keys(result).forEach((year) => { if (!display_years.includes(parseInt(year)) && !!result[year]) { delete result[year]; } })
		return { ...sector, data: result, }
	});

	const chartLabels = display_years.map((year) => `${year}`);
	const chartData = top_sectors.map((sector) => {
		return {
			name: sector.name,
			data: chartLabels.map((year) => sector.data[year]),
			fill: getRandomElement(FILLS),
			backgroundColor: getRandomColor(),
			borderColor: getRandomColor(),
		}
	});

	// Continent wise emissions
	const continents = getUnique(disasters, "continent");
	const countries_with_continent = uniqBy(disasters, "country").map(({ country, continent }) => ({ [country]: continent }));
	const emissions_with_continent = emissions.map((emission) => {
		const continent = countries_with_continent.find((country) => Object.keys(country)[0] === emission.country);
		return { ...emission, continent: continent ? Object.values(continent)[0] : "Unknown" }
	});

	const continent_wise_emissions = continents.map((continent) => {
		return {
			label: continent,
			value: sumBy(emissions_with_continent.filter((r) => r.continent === continent), "emission_value"),
		}
	});

	debugger

	// Most emissions by Country
	const countries = getUnique(emissions, "country");
	let country_wise_emissions = countries.map((country) => {
		return {
			label: country,
			value: sumBy(emissions.filter((r) => r.country === country), "emission_value"),
		}
	});

	country_wise_emissions = slice(reverse(sortBy(country_wise_emissions, (r) => r.value)), 0, PICK_TOP_COUNTRIES);

	// Sector wise emissions
	const emission_wise = [
		{ label: "Emissions", value: "emissions_value", },
	]
	const sector_wise_emissions = emission_wise.map((type) => {
		let data = sectors.map((sector) => sumBy(emissions.filter((e) => e.sector === sector), type.value));
		data = data.map(r => Math.log(r))
		return { name: type.label, data, }
	});

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Emissions | Global Warning`}</title>
			</Helmet>

			{loading ? <Loading /> :
				<React.Fragment>
					<Container maxWidth="xl">
						<Typography variant="h4" sx={{ mb: 5 }}>
							{years.length ? `Showing stats from ${yearRange[0]} to ${yearRange[1]}` : `Hi, Welcome back`}
						</Typography>

						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={6}>
								<AppWidgetSummary title={`Total GHG emissions (MtCO2e)`} total={total_MTCO2e} color={`error`} icon={'mdi:gas-co2'} />
							</Grid>

							<Grid item xs={12} sm={6} md={6}>
								<AppWidgetSummary title={`Countries involved`} total={affected_countries} color={`info`} icon={'ph:globe-hemisphere-west-fill'} />
							</Grid>

							<Grid item xs={12}>
								<Box sx={{ height: '100%' }}>
									<Slider
										getAriaLabel={() => 'Years'}
										value={yearRange}
										onChange={onSliderChange}
										valueLabelDisplay={`auto`}
										getAriaValueText={(value) => `Year: ${value}`}
										valueLabelFormat={(value) => `Year: ${value}`}
										disableSwap
										marks={marks}
										min={min(years)}
										max={max(years)}
									/>
								</Box>
							</Grid>

							<Grid item xs={12} md={6} lg={8}>
								<AppWebsiteVisits
									title={`Emissions by sector`}
									subheader={`Total GHG emissions (MtCO2e) per year`}
									chartLabels={chartLabels}
									chartData={chartData}
								/>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<AppCurrentVisits
									title={`Emissions by continent`}
									chartData={continent_wise_emissions}
									chartColors={[
										theme.palette.primary.main,
										theme.palette.info.main,
										theme.palette.warning.main,
										theme.palette.error.main,
									]}
								/>
							</Grid>

							<Grid item xs={12} md={6} lg={8}>
								<AppConversionRates
									title={`Top ${PICK_TOP_COUNTRIES} countries with highest emissions`}
									subheader={`Total emissions per country (from ${yearRange[0]} to ${yearRange[1]}) - MtCO2e`}
									chartData={country_wise_emissions}
								/>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<AppCurrentSubject
									title={`Emissions per sector`}
									chartLabels={disaster_type}
									chartData={sector_wise_emissions}
									chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
								/>
							</Grid>
						</Grid>
					</Container>
				</React.Fragment>
			}
		</React.Fragment>
	);
};

export default Emissions;
