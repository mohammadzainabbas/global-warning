import { combineReducers } from "redux";
import { reducer as homeReducer } from "../components/Home/reducer";

const rootReducer = combineReducers({
	HOME: homeReducer
});

export default rootReducer;