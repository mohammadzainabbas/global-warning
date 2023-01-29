import React from "react";

const Home = ({ data }) => {
	const {emissions, naturalDisasters} = data;

	

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
