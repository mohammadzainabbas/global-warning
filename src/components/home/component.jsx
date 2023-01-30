import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, CircularProgress } from '@mui/material';
import {
	AppTasks,
	AppCurrentVisits,
	AppWebsiteVisits,
	AppWidgetSummary,
	AppCurrentSubject,
	AppConversionRates,
} from '../../sections/@dashboard/app';
import { fetchDisasters, fetchEmissions } from "../../api/api";

import { sumBy, uniqBy, min, max } from 'lodash';

// const getUnique = (arr, comp) => [...new Set(arr.map(x => x[comp]))];
const getUnique = (arr, comp) => uniqBy(arr, comp);




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

			setTotalDisasters(_disasters);
			setDisasters(_disasters);
			setEmissions(_emissions);
			setYears(_years);
			setYearRange([min(_years), max(_years)]);

			updateEmissions(_emissions);
			updateNaturalDisasters(_disasters);

			setLoading(false);
		})();
		// return () => resetData();
	}, [updateEmissions, updateNaturalDisasters]);

	useEffect(() => {

		const _disasters = totalDisasters.filter((disaster) => {
			return disaster.year >= yearRange[0] && disaster.year <= yearRange[1];
		});
		setLoading(true);
		setDisasters(_disasters);
		setLoading(false);

	}, [yearRange, totalDisasters]);

	const disaster_type = getUnique(disasters, "disaster_type");
	const total_deaths = sumBy(disasters, "total_deaths");
	const total_affected = sumBy(disasters, "total_affected");
	const affected_countries = getUnique(disasters, "disaster_type");
	const total_disasters = disasters.length;

	debugger

	console.log(disaster_type);

	return (
		<React.Fragment>
			<Helmet>
				<title> Home | Global Warning </title>
			</Helmet>

			<Container maxWidth="xl">
				<Typography variant="h4" sx={{ mb: 5 }}>
					{`Hi, Welcome back`}
				</Typography>

				<Grid container spacing={3}>
					<Grid item xs={12} sm={6} md={3}>
						<AppWidgetSummary title={`Total deaths`} total={714000} color={`error`} icon={'mdi:emoticon-dead'} />
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<AppWidgetSummary title={`Total affected`} total={1352831} color={`warning`} icon={'material-symbols:personal-injury'} />
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<AppWidgetSummary title={`Total natural disasters`} total={1723315} color={`secondary`} icon={'mdi:home-climate-outline'} />
					</Grid>

					<Grid item xs={12} sm={6} md={3}>
						<AppWidgetSummary title={`Countries affected`} total={234} color={`info`} icon={'ph:globe-hemisphere-west-fill'} />
					</Grid>

					<Grid item xs={12} md={6} lg={8}>
						<AppWebsiteVisits
							title="Website Visits"
							subheader="(+43%) than last year"
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
	);
};

export default Home;
