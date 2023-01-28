import React from "react";

const Home = ({ emissions, disasters }) => {
	console.group("emissions");
	console.table(emissions);
	console.groupEnd();

	console.groupCollapsed("disasters");
	console.table(disasters);
	console.groupEnd();

	return (
		<>
			<h1>Home</h1>
		</>
	);
};

export default Home;
