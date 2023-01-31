/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useCallback } from "react";

import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export type Mode = "side-by-side" | "split-screen";

function ControlPanel(props: { mode: Mode; onModeChange: (newMode: Mode) => void }) {
	const onModeChange = useCallback(
		(evt: any) => {
			props.onModeChange(evt.target.value as Mode);
		},
		[props.onModeChange]
	);

	return (
		<div className="control-panel">
			<Box sx={{ minWidth: 120 }}>
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">Age</InputLabel>
					<Select labelId="demo-simple-select-label" id="demo-simple-select" value={age} label="Age" onChange={handleChange}>
						<MenuItem value={10}>Ten</MenuItem>
						<MenuItem value={20}>Twenty</MenuItem>
						<MenuItem value={30}>Thirty</MenuItem>
					</Select>
				</FormControl>
			</Box>

			<h3>{`Select mode`}</h3>
			{/* <p>Synchronize two maps.</p> */}

			<div>
				<label>Mode: </label>
				<select value={props.mode} onChange={onModeChange}>
					<option value="side-by-side">{`Side by side`}</option>
					<option value="split-screen">{`Split screen`}</option>
				</select>
			</div>
		</div>
	);
}

export default React.memo(ControlPanel);
