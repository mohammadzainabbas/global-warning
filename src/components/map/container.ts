import { connect } from "react-redux";
import GlobalWarningMap from "./component";

const mapStateToProps = (state: any) => ({
	data: state.HOME.data,
});

const mapDispatchToProps = (dispatch: any, props: any) => ({
	// dispatchAction: () => dispatch(ACTION_MANAGEMENT()),
});

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => ({
	...stateProps,
	...dispatchProps,
	...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(GlobalWarningMap);
