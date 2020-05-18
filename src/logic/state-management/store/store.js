import { applyMiddleware, combineReducers, compose, createStore } from "redux";

const thunkMiddleware = require("redux-thunk").default;

let reducers = {};

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const allStoreEnhancers = composeEnhancers(
    applyMiddleware(thunkMiddleware),
    // (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);
export const store = createStore(s => s, allStoreEnhancers); // allStoreEnhancers

store.injectReducer = (key, reducer) => {
    reducers[key] = reducer;
    store.replaceReducer(combineReducers(reducers));
};