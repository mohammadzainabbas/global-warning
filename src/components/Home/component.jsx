import React from "react";

const getUnique = (arr, comp) => [...new Set(arr.map(x => x[comp]))];

const Home = ({ data }) => {
	const {emissions, naturalDisasters} = data;

	const disaster_type = getUnique(naturalDisasters, "disaster_type");
	


	return (
		<React.Fragment>
			<h1>Home</h1>
			{emissions && (
				<>
					<h2>{`Total ${emissions.length} emissions`}</h2>
				</>
			 )}
			{naturalDisasters && (
				<>
					<h2>{`Total ${naturalDisasters.length} disasters`}</h2>
				</>
			 )}
		</React.Fragment>
	);
};

export default Home;
