import { useLayoutEffect, useState } from "react";
import { getState, makeActionName, subscribe } from "./helpers";
import { store } from "./store";

const storeKey = "auth0";

// DEFINITIONS
const initialState = {
    isAuthenticated: false,
    user: null,
    auth0Client: null,
    loading: true,
    popupOpen: false
};

const SET_IS_AUTHENTICATED = makeActionName(storeKey, "setIsAuthenticated");
const SET_USER = makeActionName(storeKey, "setUser");
const SET_AUTH0 = makeActionName(storeKey, "setAuth0");
const SET_LOADING = makeActionName(storeKey, "setLoading");
const SET_POPUP_OPEN = makeActionName(storeKey, "setPopupOpen");

// noinspection JSUnusedGlobalSymbols
const reducers = {
    [SET_IS_AUTHENTICATED]: (state, authenticated) => ({...state, isAuthenticated: authenticated}),
    [SET_USER]: (state, user) => ({...state, user: user}),
    [SET_AUTH0]: (state, auth0Client) => ({...state, auth0Client: auth0Client}),
    [SET_LOADING]: (state, loading) => ({...state, loading: loading}),
    [SET_POPUP_OPEN]: (state, popupOpen) => ({...state, popupOpen: popupOpen})
};

// EXPORTS
export const useIsAuthenticated = () => {
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state.isAuthenticated;
};

export const useUser = () => {
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state.user;
};

export const useAuth0Client = () => {
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state.auth0Client;
};

// (cheater function for loading in the background)
export const getTokenOnce = async () => {
    const client = getState(storeKey).auth0Client;
    return client.getTokenSilently(client.options);
};

export const useLoading = () => {
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state.loading;
};

export const usePopupOpen = () => {
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state.popupOpen;
};

export const setIsAuthenticated = (authenticated) =>
    store.dispatch({type: SET_IS_AUTHENTICATED, payload: authenticated});
export const setUser = (user) =>
    store.dispatch({type: SET_USER, payload: user});
export const setAuth0 = (client) =>
    store.dispatch({type: SET_AUTH0, payload: client});
export const setLoading = (loading) =>
    store.dispatch({type: SET_LOADING, payload: loading});
export const setPopupOpen = (open) =>
    store.dispatch({type: SET_POPUP_OPEN, payload: open});

// inject reducer
store.injectReducer(storeKey, (state = initialState, {type, payload}) =>
    reducers[type] ? reducers[type](state, payload) : state
);
