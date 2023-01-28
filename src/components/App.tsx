import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { fetchDisasters, fetchEmissions } from "../api/api";

const App = () => {
	useEffect(() => {
		(async () => {
			const disasters = await fetchDisasters();
			const emissions = await fetchEmissions();
			console.groupCollapsed("disasters");
			console.table(disasters);
			console.groupEnd();

			console.groupCollapsed("emissions");
			console.table(emissions);
			console.groupEnd();
		})();
	}, []);

	return (
		<React.Fragment>
			<h1>Hello World</h1>
		</React.Fragment>
	);
};

export default App;