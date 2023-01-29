import { combineReducers } from "redux";
import { reducer as homeReducer } from "../components/home/reducer";

const rootReducer = combineReducers({
	HOME: homeReducer
});

export default rootReducer;