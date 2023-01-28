import { applyMiddleware, compose, legacy_createStore as createStore } from "redux";
import rootReducer from "../reducers/rootReducer";
import thunk from "redux-thunk";
import initialState from "./initialState";
import { createLogger } from "redux-logger";
// import reduxImmutableStateInvariant from "redux-immutable-state-invariant";

// const middleware = [thunk, reduxImmutableStateInvariant()];
const middleware = [thunk];

middleware.push(createLogger({
    duration: true,
    diff: true
}));

let composedMiddleWare = compose(applyMiddleware(...middleware));

if (!!window.__REDUX_DEVTOOLS_EXTENSION__) {
    composedMiddleWare = compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true })
    );
}

const store = createStore(rootReducer, initialState, composedMiddleWare);

export default store;