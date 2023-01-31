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
import { sumBy, min, max } from 'lodash';

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

const MIN_DISTANCE = 5; // min years to show

const Home = (props) => {
	const theme = useTheme();

	const [loading, setLoading] = useState(true);
	const [totalEmissions, setTotalEmissions] = useState([]);
	const [totalDisasters, setTotalDisasters] = useState([]);
	const [emissions, setEmissions] = useState([]);
	const [disasters, setDisasters] = useState([]);
	const [years, setYears] = useState([]);
	const [yearRange, setYearRange] = useState([]);

	useEffect(() => {
		(async () => {
			const _disasters = await fetchDisasters();
			const _emissions = await fetchEmissions();
			const disasters_years = getUnique(_disasters, "year");
			const emissions_years = getUnique(_emissions, "year");
			const _years = disasters_years.filter((year) => emissions_years.includes(year));
			const max_year = max(_years);
			const min_year = min(_years) + parseInt((max_year - min(_years)) / 2);

			setTotalDisasters(_disasters);
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

	const onSliderChange = (_, newValue, activeThumb) => {
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
		const _emissions = totalEmissions.filter((emission) => emission.year >= _min_year && emission.year <= _max_year);
		setDisasters(_disasters);
		setEmissions(_emissions);
		setYearRange([_min_year, _max_year]);
	};

	// For disasters
	const total_deaths = sumBy(disasters, "total_deaths") || 0;
	const total_affected = sumBy(disasters, "total_affected") || 0;
	const affected_countries = getUnique(disasters, "country")?.length || 0;
	const total_disasters = disasters.length || 0;

	// For emissions
	const total_MTCO2e = Number(sumBy(emissions, "emission_value")) || 0;
	const emissions_by_countries = getUnique(emissions, "country")?.length || 0;

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Home | Global Warning`}</title>
			</Helmet>

			{loading ? <Loading /> :
				<React.Fragment>
					<Container maxWidth="xl">
						<Typography variant="subtitle2" sx={{ mb: 2 }}>
							{`Hi, let's explore together the devastating impact of climate change through the lens of natural disasters and emissions.`}
						</Typography>
						<Typography variant="subtitle2" sx={{ mb: 3 }}>
							{years.length ? `Showing stats from ${yearRange[0]} to ${yearRange[1]}` : ``}
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
							<Grid item xs={12} sm={6} md={6}>
								<AppWidgetSummary title={`Total GHG emissions (MtCO2e)`} total={total_MTCO2e} color={`error`} icon={'mdi:gas-co2'} />
							</Grid>

							<Grid item xs={12} sm={6} md={6}>
								<AppWidgetSummary title={`Countries involved`} total={emissions_by_countries} color={`info`} icon={'ph:globe-hemisphere-west-fill'} />
							</Grid>
						</Grid>
					</Container>
				</React.Fragment>
			}
		</React.Fragment>
	);
};

export default Home;
