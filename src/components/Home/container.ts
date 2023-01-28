import { connect } from "react-redux";
import { Home } from "./component";

const mapStateToProps = (state) => ({
	// data: state.ACTION_MANAGEMENT.data,
});

const mapDispatchToProps = (dispatch, props) => ({
	// dispatchAction: () => dispatch(ACTION_MANAGEMENT()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
	...stateProps,
	...dispatchProps,
	...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Home);
