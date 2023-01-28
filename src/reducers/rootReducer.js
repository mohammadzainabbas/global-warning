import { combineReducers } from "redux";
import { homeReducer } from "../components/Home/reducer";

const rootReducer = combineReducers({
	HOME: homeReducer
});

export default rootReducer;