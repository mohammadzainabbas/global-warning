import { connect } from "react-redux";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import Home from "./home/container";
import { updateEmissions, updateNaturalDisasters, resetData } from "./home/actions";

import { fetchDisasters, fetchEmissions } from "../api/api";
import { DSVParsedArray } from "d3";

import ThemeProvider from "../theme";
import ScrollToTop from "./scroll-to-top/ScrollToTop";
import { StyledChart } from "./chart";
import Router from "./router/routes";

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
		})();
		return () => resetData();
	}, [updateEmissions, updateNaturalDisasters, resetData]);

	return (
		<React.Fragment>
			<ThemeProvider>
				<ScrollToTop />
				<StyledChart />
				<Router />
				{/* <Home emissions={emissions} disasters={disasters} /> */}
			</ThemeProvider>
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
