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
				debugger
				const clamped = Math.min(newValue[0], max_year - MIN_DISTANCE);
				_min_year = clamped;
				_max_year = clamped + MIN_DISTANCE;
			} else {
				const clamped = Math.max(newValue[1], min_year + MIN_DISTANCE);
				_min_year = clamped - MIN_DISTANCE;
				_max_year = clamped;
				debugger
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


	console.log(chartData);

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
									subheader={`(+43%) than last year`}
									chartLabels={chartLabels}
									chartData={chartData}
								// chartLabels={[
								// 	'01/01/2003',
								// 	'02/01/2003',
								// 	'03/01/2003',
								// 	'04/01/2003',
								// 	'05/01/2003',
								// 	'06/01/2003',
								// 	'07/01/2003',
								// 	'08/01/2003',
								// 	'09/01/2003',
								// 	'10/01/2003',
								// 	'11/01/2003',
								// ]}
								// chartData={[
								// 	{
								// 		name: 'Team A',
								// 		type: 'column',
								// 		fill: 'solid',
								// 		data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
								// 	},
								// 	{
								// 		name: 'Team B',
								// 		type: 'area',
								// 		fill: 'gradient',
								// 		data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
								// 	},
								// 	{
								// 		name: 'Team C',
								// 		type: 'line',
								// 		fill: 'solid',
								// 		data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
								// 	},
								// ]}
								/>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<AppCurrentVisits
									title="Current Visits"
									chartData={[
										{ label: 'America', value: 4344 },
										{ label: 'Asia', value: 5435 },
										{ label: 'Europe', value: 1443 },
										{ label: 'Africa', value: 4443 },
									]}
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
									title="Conversion Rates"
									subheader="(+43%) than last year"
									chartData={[
										{ label: 'Italy', value: 400 },
										{ label: 'Japan', value: 430 },
										{ label: 'China', value: 448 },
										{ label: 'Canada', value: 470 },
										{ label: 'France', value: 540 },
										{ label: 'Germany', value: 580 },
										{ label: 'South Korea', value: 690 },
										{ label: 'Netherlands', value: 1100 },
										{ label: 'United States', value: 1200 },
										{ label: 'United Kingdom', value: 1380 },
									]}
								/>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<AppCurrentSubject
									title="Current Subject"
									chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
									chartData={[
										{ name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
										{ name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
										{ name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
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
