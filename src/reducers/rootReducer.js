import { combineReducers } from "redux";
import { loginReducer } from "../components/Login/loginReducer";

const rootReducer = combineReducers({
	LOGIN: loginReducer
});

export default rootReducer;