import { getState, makeActionName, subscribe } from "./store/helpers";
import { useLayoutEffect, useState } from "react";
import { store } from "./store/store";

const storeKey = "errorMessage";

const SET = makeActionName(storeKey, "set");
const CLEAR = makeActionName(storeKey, "clear");

const DEFAULT_SCOPE = "global";

// DEFINITIONS
const reducers = {
    [SET]: (state, {message, scope}) => {
        const newState = Object.assign({}, state);
        newState[scope] = message;
        return newState;
    },
    [CLEAR]: (state, {scope}) => {
        const newState = Object.assign({}, state);
        newState[scope] = null;
        return newState;
    }
};

const initialState = {
    global: null
}

// EXPORTS -- setters
export const setErrorMessage = (message, scope = DEFAULT_SCOPE) =>
    store.dispatch({
        type: SET,
        payload: {message: message, scope: scope}
    });
export const clearErrorMessage = (scope = DEFAULT_SCOPE) =>
    store.dispatch({
        type: CLEAR,
        payload: {scope: scope}
    });

store.injectReducer(storeKey, (state = initialState, {type, payload}) =>
    reducers[type] ? reducers[type](state, payload) : state
);

// -- hooks
/**
 * Subscribes to the error message for the given scope.
 * @param scope "global" by default
 * @returns {*|string}
 */
export const useErrorMessage = (scope = DEFAULT_SCOPE) => {
    // for how this exactly works, look in useTargets() in "./redux/targets"
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state[scope];
};

// -- helpers
export const defaultFailureCallback = (error) => {
    setErrorMessage(JSON.stringify(error.message));
}