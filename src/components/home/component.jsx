import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Container, Typography, CircularProgress, Slider } from '@mui/material';
import {
	AppTasks,
	AppCurrentVisits,
	AppWebsiteVisits,
	AppWidgetSummary,
	AppCurrentSubject,
	AppConversionRates,
} from '../../sections/@dashboard/app';
import { fetchDisasters, fetchEmissions } from "../../api/api";
import { styled } from '@mui/material/styles';
import { sumBy, sortBy, reverse, min, max, slice } from 'lodash';

const getUnique = (arr, comp) => [...new Set(arr.map(x => x[comp]))];
// const getUnique = (arr, comp) => uniqBy(arr, comp);

const StyledSlider = styled(Slider)({
	color: '#52af77',
	height: 8,
	'& .MuiSlider-track': {
		border: 'none',
	},
	'& .MuiSlider-thumb': {
		height: 24,
		width: 24,
		backgroundColor: '#fff',
		border: '2px solid currentColor',
		'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
			boxShadow: 'inherit',
		},
		'&:before': {
			display: 'none',
		},
	},
	'& .MuiSlider-valueLabel': {
		lineHeight: 1.2,
		fontSize: 12,
		background: 'unset',
		padding: 0,
		width: 60,
		height: 60,
		borderRadius: '50% 50% 50% 0',
		backgroundColor: '#52af77',
		transformOrigin: 'bottom left',
		transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
		'&:before': { display: 'none' },
		'&.MuiSlider-valueLabelOpen': {
			transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
		},
		'& > *': {
			transform: 'rotate(45deg)',
		},
	},
});

export const Loading = () => {
	return (
		<Box sx={{ display: 'flex' }}>
			<CircularProgress sx={{
				margin: 'auto',
			}} />
		</Box>
	);
}

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

	const MIN_DISTANCE = 5; // min years to show
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

	const disaster_type = getUnique(disasters, "disaster_type");
	const disaster_type_count = disaster_type.map((type) => {
		return {
			name: type,
			data: disasters.filter((disaster) => disaster.disaster_type === type).map(({ total_deaths, year }) => ({ total_deaths, year })),
		}
	});

	const PICK_TOP = 3;
	const top_disasters = slice(reverse(sortBy(disaster_type_count, (r) => r.data.length)), 0, PICK_TOP);
	debugger


	console.log(disaster_type_count);

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
									chartLabels={[
										'01/01/2003',
										'02/01/2003',
										'03/01/2003',
										'04/01/2003',
										'05/01/2003',
										'06/01/2003',
										'07/01/2003',
										'08/01/2003',
										'09/01/2003',
										'10/01/2003',
										'11/01/2003',
									]}
									chartData={[
										{
											name: 'Team A',
											type: 'column',
											fill: 'solid',
											data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
										},
										{
											name: 'Team B',
											type: 'area',
											fill: 'gradient',
											data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
										},
										{
											name: 'Team C',
											type: 'line',
											fill: 'solid',
											data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
										},
									]}
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
