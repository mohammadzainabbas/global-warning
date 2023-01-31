import { connect } from "react-redux";
import Emissions from "./component";

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any, props: any) => ({});

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => ({
	...stateProps,
	...dispatchProps,
	...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Emissions);
