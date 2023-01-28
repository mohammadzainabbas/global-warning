import React, { useEffect } from "react";
import "./App.css";

import { fetchDisasters, fetchEmissions } from "../api/api";

const App = () => {
	const [disasters, setDisasters] = React.useState([]);
	const [emissions, setEmissions] = React.useState([]);

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
		<React.Fragment>
			<h1>Hello World</h1>
		</React.Fragment>
	);
};

export default App;
