import React, { useEffect } from "react";
import "./App.css";

import { fetchDisasters, fetchEmissions } from "../api/api";

const App = () => {
	const [disasters, setDisasters] = React.useState<DSVParsedArray<object>>([]);
	const [emissions, setEmissions] = React.useState<DSVParsedArray<object>>([]);

	useEffect(() => {
		(async () => {
			const _disasters = await fetchDisasters();
			const _emissions = await fetchEmissions();

			// console.group("disasters");
			// console.table(disasters);
			// console.groupEnd();

			// console.groupCollapsed("emissions");
			// console.table(emissions);
			// console.groupEnd();
		})();
		setDisasters(_disasters);
		setEmissions(_emissions);
	}, []);

	return (
		<React.Fragment>
			<h1>Hello World</h1>
		</React.Fragment>
	);
};

export default App;
