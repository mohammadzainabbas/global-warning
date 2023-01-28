import React, { useEffect } from "react";
import "./App.css";

import { fetchDisasters, fetchEmissions } from "../api/api";

const App = () => {
	const [disasters, setDisasters] = React.useState([]);
	const [emissions, setEmissions] = React.useState([]);

	useEffect(() => {
		(async () => {
			const disasters = await fetchDisasters();
			const emissions = await fetchEmissions();

			setDisasters(disasters);
			setEmissions(emissions);
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
