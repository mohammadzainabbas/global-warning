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
					<InputLabel id={`"select-label`}>{`Mode`}</InputLabel>
					<Select labelId={`select-label`} id={`select`} value={props.mode} label={`Mode`} onChange={onModeChange}>
						<MenuItem value={`side-by-side`}>{`Side by side`}</MenuItem>
						<MenuItem value={`split-screen`}>{`Split screen`}</MenuItem>
					</Select>
				</FormControl>
			</Box>
		</div>
	);
}

export default React.memo(ControlPanel);
