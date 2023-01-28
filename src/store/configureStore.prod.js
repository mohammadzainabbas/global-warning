import {applyMiddleware, legacy_createStore as createStore} from "redux";
import rootReducer from "../reducers/rootReducer";
import thunk from "redux-thunk";
import initialState from "./initialState";

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

export default store;