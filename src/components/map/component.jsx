/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Container, Typography, CircularProgress, Slider } from '@mui/material';
import { fetchDisasters, fetchEmissions } from "../../api/api";
import { sumBy, sortBy, reverse, min, max, slice } from 'lodash';

import { MAPGL_TOKEN_PUBLIC } from "../../common/constants";

import Map, { Source, Layer } from 'react-map-gl';
import ControlPanel, { Mode } from './control-panel';

const DATA = [
	{ 'code': 'ROU', 'hdi': 0.811 },
	{ 'code': 'RUS', 'hdi': 0.816 },
	{ 'code': 'SRB', 'hdi': 0.787 },
	{ 'code': 'SVK', 'hdi': 0.855 },
	{ 'code': 'SVN', 'hdi': 0.896 },
	{ 'code': 'ESP', 'hdi': 0.891 },
	{ 'code': 'SWE', 'hdi': 0.933 },
	{ 'code': 'CHE', 'hdi': 0.944 },
	{ 'code': 'HRV', 'hdi': 0.831 },
	{ 'code': 'CZE', 'hdi': 0.888 },
	{ 'code': 'DNK', 'hdi': 0.929 },
	{ 'code': 'EST', 'hdi': 0.871 },
	{ 'code': 'FIN', 'hdi': 0.92 },
	{ 'code': 'FRA', 'hdi': 0.901 },
	{ 'code': 'DEU', 'hdi': 0.936 },
	{ 'code': 'GRC', 'hdi': 0.87 },
	{ 'code': 'ALB', 'hdi': 0.785 },
	{ 'code': 'AND', 'hdi': 0.858 },
	{ 'code': 'AUT', 'hdi': 0.908 },
	{ 'code': 'BLR', 'hdi': 0.808 },
	{ 'code': 'BEL', 'hdi': 0.916 },
	{ 'code': 'BIH', 'hdi': 0.768 },
	{ 'code': 'BGR', 'hdi': 0.813 },
	{ 'code': 'MKD', 'hdi': 0.757 },
	{ 'code': 'MLT', 'hdi': 0.878 },
	{ 'code': 'MDA', 'hdi': 0.7 },
	{ 'code': 'MNE', 'hdi': 0.814 },
	{ 'code': 'NLD', 'hdi': 0.931 },
	{ 'code': 'NOR', 'hdi': 0.953 },
	{ 'code': 'POL', 'hdi': 0.865 },
	{ 'code': 'PRT', 'hdi': 0.847 },
	{ 'code': 'HUN', 'hdi': 0.838 },
	{ 'code': 'ISL', 'hdi': 0.935 },
	{ 'code': 'IRL', 'hdi': 0.938 },
	{ 'code': 'ITA', 'hdi': 0.88 },
	{ 'code': 'LVA', 'hdi': 0.847 },
	{ 'code': 'LIE', 'hdi': 0.916 },
	{ 'code': 'LTU', 'hdi': 0.858 },
	{ 'code': 'LUX', 'hdi': 0.904 },
	{ 'code': 'UKR', 'hdi': 0.751 },
	{ 'code': 'GBR', 'hdi': 0.922 }
];

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

function generateGradient(minColor, maxColor, numElements) {
	let gradient = [];
	let minRgb = hexToRgb(minColor);
	let maxRgb = hexToRgb(maxColor);

	let stepR = (maxRgb.r - minRgb.r) / (numElements - 1);
	let stepG = (maxRgb.g - minRgb.g) / (numElements - 1);
	let stepB = (maxRgb.b - minRgb.b) / (numElements - 1);

	for (let i = 0; i < numElements; i++) {
		let color = {
			r: minRgb.r + stepR * i,
			g: minRgb.g + stepG * i,
			b: minRgb.b + stepB * i,
		};

		gradient.push(rgbToHex(color));
	}

	return gradient;
}

function hexToRgb(hex) {
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);
	return { r, g, b };
}

function rgbToHex(rgb) {
	let r = rgb.r.toString(16).padStart(2, "0");
	let g = rgb.g.toString(16).padStart(2, "0");
	let b = rgb.b.toString(16).padStart(2, "0");
	return `${r}${g}${b}`;
}

const getMatchExpression = (data, isDisaster) => {
	const matchExpression = ['match', ['get', 'iso_3166_1_alpha_3']];

	const min_color = isDisaster ? 'rgb(255, 0, 0)' : 'rgb(0, 255, 0)';
	const max_color = isDisaster ? 'rgb(0, 0, 255)' : 'rgb(255, 0, 0)';

	const gradients = generateGradient(min_color, max_color, data.length);

	const _data = reverse(sortBy(data, 'value'))

	_data.forEach((row, index) => {
		matchExpression.push(row['ISO'], gradients[index]);
	});

	matchExpression.push('rgba(0, 0, 0, 0)');

	return matchExpression;
}

const matchExpression = ['match', ['get', 'iso_3166_1_alpha_3']];

for (const row of DATA) {
	// Convert the range of data values to a suitable color
	const green = row['hdi'] * 255;
	const color = `rgb(0, ${green}, 0)`;

	// matchExpression.push(row['code'], color);
	matchExpression.push(row['code'], getRandomColor());
}

matchExpression.push('rgba(0, 0, 0, 0)');

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

const PICK_TOP_COUNTRIES = 10;
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

	const geojson = {
		type: 'FeatureCollection',
		features: [
			{ type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4, 37.8] } }
		]
	};

	const layerStyle = {
		id: 'point',
		type: 'circle',
		paint: {
			'circle-radius': 10,
			'circle-color': '#007cbf'
		}
	};

	const [loading, setLoading] = useState(true);
	const [totalEmissions, setTotalEmissions] = useState([]);
	const [totalDisasters, setTotalDisasters] = useState([]);
	const [emissions, setEmissions] = useState([]);
	const [disasters, setDisasters] = useState([]);
	const [years, setYears] = useState([]);
	const [yearRange, setYearRange] = useState([]);

	useEffect(() => {
		(async () => {
			// let _countries = await fetch(`https://raw.githubusercontent.com/eesur/country-codes-lat-long/master/country-codes-lat-long-alpha3.json`)
			// 	.then(response => response.json())
			// 	.then(data => data['ref_country_codes']);
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
		const _emissions = totalEmissions.filter((emission) => emission.year >= _min_year && emission.year <= _max_year);
		setDisasters(_disasters);
		setEmissions(_emissions);
		setYearRange([_min_year, _max_year]);
	};

	const display_years = generateList(yearRange[0], yearRange[1]);

	// for disasters
	let countries_iso = getUnique(disasters, "ISO");
	let country_wise_affected = countries_iso.map((iso) => {
		return {
			ISO: iso,
			value: sumBy(disasters.filter((disaster) => disaster.ISO === iso), "total_affected"),
		}
	});
	country_wise_affected = slice(reverse(sortBy(country_wise_affected, (r) => r.value)), 0, PICK_TOP_COUNTRIES);
	const disasterMatchExpression = getMatchExpression(country_wise_affected, true);
	const disasterLayerStyle = {
		id: 'countries-join',
		type: 'fill',
		source: 'countries',
		'source-layer': 'country_boundaries',
		paint: {
			'fill-color': disasterMatchExpression,
		}
	};

	// for emissions
	const emissionMatchExpression = getMatchExpression(emissions, false);
	const emissionLayerStyle = {
		id: 'countries-join',
		type: 'fill',
		source: 'countries',
		'source-layer': 'country_boundaries',
		paint: {
			'fill-color': emissionMatchExpression,
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Map | Global Warning`}</title>
			</Helmet>

			{loading ? <Loading /> :
				<React.Fragment>
					<Container maxWidth={`xl`}>
						<Typography variant={`h5`} sx={{ mb: 5 }}>
							{years.length ? `Showing stats from ${yearRange[0]} to ${yearRange[1]}` : `Hi, Welcome back`}
						</Typography>

						<Grid container spacing={3}>
							<Grid item xs={12} sx={{ mb: 0 }}>
								<Box sx={{ height: `100%`, mb: 0 }}>
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
							<Grid item xs={12} sm={4} md={4}>
							</Grid>
							<Grid item xs={12} sm={4} md={4}>
								<ControlPanel mode={mode} onModeChange={setMode} />
							</Grid>
							<Grid item xs={12} sm={4} md={4}>
							</Grid>
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
									>
										{/* <Source id="my-data" type="geojson" data={geojson}>
											<Layer {...layerStyle} />
										</Source> */}
										<Source
											id={`countries`}
											name={`countries`}
											type={`vector`}
											url={`mapbox://mapbox.country-boundaries-v1`}
										>
											<Layer {...disasterLayerStyle} />
										</Source>

									</Map>
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
									>
										<Source
											id={`countries`}
											name={`countries`}
											type={`vector`}
											url={`mapbox://mapbox.country-boundaries-v1`}
										>
											<Layer {...layerStyle} />
										</Source>
									</Map>
								</div>
							</Grid>
						</Grid>
					</Container>
				</React.Fragment>
			}
		</React.Fragment >
	);
};

export default GlobalWarningMap;