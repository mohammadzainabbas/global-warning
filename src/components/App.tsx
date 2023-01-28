import { connect } from "react-redux";
import React, { useEffect } from "react";
import "./App.css";
import Home from "./Home/component";
import { updateEmissions, updateNaturalDisasters } from "./Home/actions";

import { fetchDisasters, fetchEmissions } from "../api/api";
import { DSVParsedArray } from "d3";

const App = () => {
	const [disasters, setDisasters] = React.useState<DSVParsedArray<object> | []>([]);
	const [emissions, setEmissions] = React.useState<DSVParsedArray<object> | []>([]);

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
			<Home emissions={emissions} disasters={disasters} />
		</React.Fragment>
	);
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any, props: any) => ({
	updateEmissions: (data: any) => dispatch(updateEmissions(data)),
});

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => ({
	...stateProps,
	...dispatchProps,
	...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
