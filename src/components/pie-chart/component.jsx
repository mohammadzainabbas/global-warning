import React from "react";

const PieChart = ({ emissions, disasters }) => {
	console.group("emissions");
	console.table(emissions);
	console.groupEnd();

	console.groupCollapsed("disasters");
	console.table(disasters);
	console.groupEnd();

	return (
		<React.Fragment>
			<h1>PieChart</h1>
		</React.Fragment>
	);
};

export default PieChart;
