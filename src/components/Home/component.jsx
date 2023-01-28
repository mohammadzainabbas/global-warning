import React from "react";

const Home = ({ data }) => {
	const {emissions, disasters} = data;

	return (
		<React.Fragment>
			<h1>Home</h1>
			{emissions && (
				<>
					<h2>{`Total ${emissions.length} emissions`}</h2>
				</>
			 )}
			{disasters && (
				<>
					<h2>{`Total ${disasters.length} disasters`}</h2>
				</>
			 )}
		</React.Fragment>
	);
};

export default Home;
