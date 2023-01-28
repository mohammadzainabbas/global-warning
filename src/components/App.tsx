import { connect } from "react-redux";
import React, { useEffect } from "react";
import "./App.css";
import Home from "./Home/container";
import { updateEmissions, updateNaturalDisasters, resetData } from "./Home/actions";

import { fetchDisasters, fetchEmissions } from "../api/api";
import { DSVParsedArray } from "d3";

const App = (props: any) => {
	const [disasters, setDisasters] = React.useState<DSVParsedArray<object> | []>([]);
	const [emissions, setEmissions] = React.useState<DSVParsedArray<object> | []>([]);

	const { updateEmissions, updateNaturalDisasters, resetData } = props;

	useEffect(() => {
		(async () => {
			const _disasters = await fetchDisasters();
			const _emissions = await fetchEmissions();

			setDisasters(_disasters);
			setEmissions(_emissions);

			updateEmissions(_emissions);
			updateNaturalDisasters(_disasters);

			// console.group("disasters");
			// console.table(disasters);
			// console.groupEnd();

			// console.groupCollapsed("emissions");
			// console.table(emissions);
			// console.groupEnd();
		})();
		return () => resetData();
	}, [updateEmissions, updateNaturalDisasters, resetData]);

	return (
		<React.Fragment>
			<Home emissions={emissions} disasters={disasters} />
		</React.Fragment>
	);
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any, props: any) => ({
	updateEmissions: (data: any) => dispatch(updateEmissions(data)),
	updateNaturalDisasters: (data: any) => dispatch(updateNaturalDisasters(data)),
});

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => ({
	...stateProps,
	...dispatchProps,
	...ownProps,
	resetData,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App);
