/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Container, Typography, CircularProgress, Slider } from '@mui/material';
import { fetchDisasters, fetchEmissions } from "../../api/api";
import { sumBy, sortBy, reverse, min, max, slice } from 'lodash';

import { MAPGL_TOKEN_PUBLIC } from "../../common/constants";

import Map from 'react-map-gl';




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


const LeftMapStyle = {
	position: 'absolute',
	width: '50%',
	height: '100%',
};
const RightMapStyle = {
	position: 'absolute',
	left: '50%',
	width: '50%',
	height: '100%'
};

const GlobalWarningMap = (props) => {
	const theme = useTheme();

	const [viewState, setViewState] = useState({
		longitude: 30.094546,
		latitude: 0.5219001,
		zoom: 0.5,
		pitch: 15
	});
	const [mode, setMode] = useState('side-by-side');

	// Two maps could be firing 'move' events at the same time, if the user interacts with one
	// while the other is in transition.
	// This state specifies which map to use as the source of truth
	// It is set to the map that received user input last ('movestart')
	const [activeMap, setActiveMap] = useState(`left`);

	const onLeftMoveStart = useCallback(() => setActiveMap(`left`), []);
	const onRightMoveStart = useCallback(() => setActiveMap(`right`), []);
	const onMove = useCallback(evt => setViewState(evt.viewState), []);

	const width = typeof window === 'undefined' ? 100 : window.innerWidth;
	const leftMapPadding = useMemo(() => {
		return { left: mode === 'split-screen' ? width / 2 : 0, top: 0, right: 0, bottom: 0 };
	}, [width, mode]);
	const rightMapPadding = useMemo(() => {
		return { right: mode === 'split-screen' ? width / 2 : 0, top: 0, left: 0, bottom: 0 };
	}, [width, mode]);


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

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Map | Global Warning`}</title>
			</Helmet>

			{loading ? <Loading /> :
				<React.Fragment>
					<Container maxWidth={`xl`}>
						<Typography variant={`h4`} sx={{ mb: 5 }}>
							{years.length ? `Showing stats from ${yearRange[0]} to ${yearRange[1]}` : `Hi, Welcome back`}
						</Typography>

						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={6}>
								<div style={{
									height: '100%',
								}}>
									<Map
										id={`left-map`}
										{...viewState}
										padding={leftMapPadding}
										onMoveStart={onLeftMoveStart}
										onMove={activeMap === `left` && onMove}
										style={LeftMapStyle}
										mapStyle={`mapbox://styles/mapbox/light-v9`}
										mapboxAccessToken={MAPGL_TOKEN_PUBLIC}
									/>
								</div>
							</Grid>
							<Grid item xs={12} sm={6} md={6}>
								<div style={{
									height: '100%',
								}}>
									<Map
										id={`right-map`}
										{...viewState}
										padding={rightMapPadding}
										onMoveStart={onRightMoveStart}
										onMove={activeMap === `right` && onMove}
										style={RightMapStyle}
										mapStyle={`mapbox://styles/mapbox/dark-v9`}
										mapboxAccessToken={MAPGL_TOKEN_PUBLIC}
									/>
								</div>
							</Grid>

							<Grid item xs={12}>
								<Box sx={{ height: `100%` }}>
									<Slider
										getAriaLabel={() => `Years`}
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
						</Grid>
					</Container>
				</React.Fragment>
			}
		</React.Fragment>
	);
};

export default GlobalWarningMap;


// import React, { useState } from 'react';
// import MapGL, { MapboxLayer } from 'react-map-gl';
// import { MAPGL_TOKEN } from '../../common/constants';

// const Map = () => {
// 	const [viewport, setViewport] = useState({
// 		latitude: 37.7577,
// 		longitude: -122.4376,
// 		zoom: 8
// 	});

// 	const data = [{ "country": "USA", "latitude": 37.0902, "longitude": -95.7129, "intensity": 10 }, { "country": "Canada", "latitude": 56.1304, "longitude": -106.3468, "intensity": 7 }, { "country": "Mexico", "latitude": 23.6345, "longitude": -102.5528, "intensity": 5 }, { "country": "Brazil", "latitude": -14.2350, "longitude": -51.9253, "intensity": 8 }];

// 	return (
// 		<MapGL
// 			{...viewport}
// 			onViewportChange={setViewport}
// 			mapStyle="mapbox://styles/mapbox/light-v9"
// 			mapboxApiAccessToken={MAPGL_TOKEN}
// 		>
// 			<MapboxLayer
// 				type="heatmap"
// 				id="heatmap"
// 				options={{
// 					source: {
// 						data,
// 					},
// 					color: [
// 						'interpolate',
// 						['linear'],
// 						['heatmap-density'],
// 						0,
// 						'rgba(33,102,172,0)',
// 						0.2,
// 						'rgb(103,169,207)',
// 						0.4,
// 						'rgb(209,229,240)',
// 						0.6,
// 						'rgb(253,219,199)',
// 						0.8,
// 						'rgb(239,138,98)',
// 						1,
// 						'rgb(178,24,43)'
// 					],
// 					intensity: [
// 						'interpolate',
// 						['linear'],
// 						['zoom'],
// 						0,
// 						1,
// 						9,
// 						3
// 					]
// 				}}
// 			/>
// 		</MapGL>
// 	);
// };

// export default Map;
