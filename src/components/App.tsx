import React, { useEffect } from "react";
import "./App.css";
import Home from "./Home/index";

import { fetchDisasters, fetchEmissions } from "../api/api";
import { DSVParsedArray } from "d3";

const App = () => {
	const [disasters, setDisasters] = React.useState<DSVParsedArray<object> | []>([]);
	const [emissions, setEmissions] = React.useState<DSVParsedArray<object> | []>([]);

	useEffect(() => {
		(async () => {
			const _disasters = await fetchDisasters();
			const _emissions = await fetchEmissions();

			setDisasters(_disasters);
			setEmissions(_emissions);
			// console.group("disasters");
			// console.table(disasters);
			// console.groupEnd();

			// console.groupCollapsed("emissions");
			// console.table(emissions);
			// console.groupEnd();
		})();
	}, []);

	return (
		<>
			<Home />
		</>
	);
};

export default App;
