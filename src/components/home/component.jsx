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
import { sumBy, sortBy, reverse, min, max, slice } from 'lodash';

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

const Home = (props) => {
	const theme = useTheme();

	const [loading, setLoading] = useState(true);
	const [totalDisasters, setTotalDisasters] = useState([]);
	const [emissions, setEmissions] = useState([]);
	const [disasters, setDisasters] = useState([]);
	const [years, setYears] = useState([]);
	const [yearRange, setYearRange] = useState([]);

	const { updateEmissions, updateNaturalDisasters } = props;

	useEffect(() => {
		(async () => {
			const _disasters = await fetchDisasters();
			const _emissions = await fetchEmissions();
			const _years = getUnique(_disasters, "year");
			const max_year = max(_years);
			const min_year = min(_years) + parseInt((max_year - min(_years)) / 2);

			setTotalDisasters(_disasters);
			setDisasters(_disasters);
			setEmissions(_emissions);
			setYears(_years);
			setYearRange([min_year, max_year]);

			// updateEmissions(_emissions);
			// updateNaturalDisasters(_disasters);

			setLoading(false);
		})();
		// return () => resetData();
	}, [updateEmissions, updateNaturalDisasters]);

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
		const _disasters = totalDisasters.filter((disaster) => disaster.year >= _min_year && disaster.year <= _max_year);
		setDisasters(_disasters);
		setYearRange([_min_year, _max_year]);
	};

	const total_deaths = sumBy(disasters, "total_deaths") || 0;
	const total_affected = sumBy(disasters, "total_affected") || 0;
	const affected_countries = getUnique(disasters, "country")?.length || 0;
	const total_disasters = disasters.length || 0;

	const display_years = generateList(yearRange[0], yearRange[1]);

	const disaster_type = getUnique(disasters, "disaster_type");

	debugger

	let disaster_type_count = disaster_type.map((type) => {
		return {
			name: type,
			data: disasters.filter((disaster) => disaster.disaster_type === type).map(({ total_deaths, year }) => ({ total_deaths, year })),
		}
	});

	disaster_type_count = disaster_type_count.map(disaster_type => {
		return {
			...disaster_type,
			data: sortBy(disaster_type.data, (r) => r.year),
		}
	});
	let top_disasters = slice(reverse(sortBy(disaster_type_count, (r) => r.data.length)), 0, PICK_TOP);
	top_disasters = top_disasters.map((disaster_type) => {
		let result = {};
		disaster_type.data.forEach(({ year, total_deaths }) => {
			if (!result[year]) { result[year] = 0; }
			result[year] += total_deaths;
		})
		let last_year = 0;
		display_years.forEach((year) => {
			if (!result[year]) { result[year] = Number(last_year * DECAY_VALUE); }
			last_year = result[year];
		})
		Object.keys(result).forEach((year) => { if (!display_years.includes(parseInt(year)) && !!result[year]) { delete result[year]; } })
		return { ...disaster_type, data: result, }
	});

	const chartLabels = display_years.map((year) => `${year}`);
	const chartData = top_disasters.map((disaster_type) => {
		return {
			name: disaster_type.name,
			data: chartLabels.map((year) => disaster_type.data[year]),
			fill: getRandomElement(FILLS),
			backgroundColor: getRandomColor(),
			borderColor: getRandomColor(),
		}
	});

	// Continent wise deaths
	const continents = getUnique(disasters, "continent");
	const continent_wise_deaths = continents.map((continent) => {
		return {
			label: continent,
			value: sumBy(disasters.filter((disaster) => disaster.continent === continent), "total_deaths"),
		}
	});

	// Country wise most affected
	const countries = getUnique(disasters, "country");
	let country_wise_affected = countries.map((country) => {
		return {
			label: country,
			value: sumBy(disasters.filter((disaster) => disaster.country === country), "total_affected"),
		}
	});

	country_wise_affected = slice(reverse(sortBy(country_wise_affected, (r) => r.value)), 0, PICK_TOP_COUNTRIES);

	// Disaster type wise deaths/affected
	const disaster_wise = [
		{
			label: "Deaths",
			value: "total_deaths",
		},
		{
			label: "Affected",
			value: "total_affected",
		}
	]
	const disaster_type_wise = disaster_wise.map((type) => {
		const data = disaster_type.map((disaster_type) => {
			sumBy(disasters.filter((disaster) => disaster.disaster_type === type), "total_deaths")
		});

		return {
			label: type.label,
		}
	});

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Home | Global Warning`}</title>
			</Helmet>

			{loading ? <Loading /> :
				<React.Fragment>
					<Container maxWidth="xl">
						<Typography variant="h4" sx={{ mb: 5 }}>
							{years.length ? `Showing stats from ${yearRange[0]} to ${yearRange[1]}` : `Hi, Welcome back`}
						</Typography>

						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={3}>
								<AppWidgetSummary title={`Total recorded deaths`} total={total_deaths} color={`error`} icon={'mdi:emoticon-dead'} />
							</Grid>

							<Grid item xs={12} sm={6} md={3}>
								<AppWidgetSummary title={`Total affected`} total={total_affected} color={`warning`} icon={'material-symbols:personal-injury'} />
							</Grid>

							<Grid item xs={12} sm={6} md={3}>
								<AppWidgetSummary title={`Total natural disasters`} total={total_disasters} color={`secondary`} icon={'mdi:home-climate-outline'} />
							</Grid>

							<Grid item xs={12} sm={6} md={3}>
								<AppWidgetSummary title={`Countries affected`} total={affected_countries} color={`info`} icon={'ph:globe-hemisphere-west-fill'} />
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
									title={`Frequency of disasters`}
									subheader={`Total deaths per year`}
									chartLabels={chartLabels}
									chartData={chartData}
								/>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<AppCurrentVisits
									title={`Deaths by continent`}
									chartData={continent_wise_deaths}
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
									title={`Top ${PICK_TOP_COUNTRIES} most affected countries`}
									subheader={`Total affected per country (from ${yearRange[0]} to ${yearRange[1]})`}
									chartData={country_wise_affected}
								/>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<AppCurrentSubject
									title={`Disasters by type`}
									chartLabels={disaster_type}
									chartData={[
										{ name: 'Series 1', data: generateList(0, disaster_type.length - 1) },
										// { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
										// { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
									]}
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

export default Home;
