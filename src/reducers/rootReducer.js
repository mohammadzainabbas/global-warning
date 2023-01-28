import { combineReducers } from "redux";
import { homeReducer } from "../components/Home/homeReducer";

const rootReducer = combineReducers({
	HOME: homeReducer
});

export default rootReducer;