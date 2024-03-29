import React from "react";

const Home = ({ emissions, disasters }) => {
	console.group("emissions");
	console.table(emissions);
	console.groupEnd();

	console.groupCollapsed("disasters");
	console.table(disasters);
	console.groupEnd();

	return (
		<React.Fragment>
			<h1>Home</h1>
		</React.Fragment>
	);
};

export default Home;
