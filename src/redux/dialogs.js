import { getState, makeActionName, subscribe } from "./helpers";
import { useLayoutEffect, useState } from "react";
import { store } from "./store";

const storeKey = "dialogs";

// DEFINITOINS
const SHOW_DIALOG = makeActionName(storeKey, "show");
const HIDE_DIALOG = makeActionName(storeKey, "hide");
const SET_INFO = makeActionName(storeKey, "setInfo");

// noinspection JSUnusedGlobalSymbols
const reducers = {
    [SHOW_DIALOG]: (state, dialogName) => reassignObject(state, dialogName, {...state[dialogName], show: true}),
    [HIDE_DIALOG]: (state, dialogName) => reassignObject(state, dialogName, {...state[dialogName], show: false}),
    [SET_INFO]: (state, {dialogName, info}) => reassignObject(state, dialogName, {...info, show: state[dialogName]?.show}),
};

// HELPERS
const reassignObject = (state, key, value) => {
    const newState = Object.assign({}, state);
    newState[key] = value;
    return newState;
};

// EXPORTS -- setters
export const showDialog = (dialogName) =>
    store.dispatch({type: SHOW_DIALOG, payload: dialogName});
export const hideDialog = (dialogName) =>
    store.dispatch({type: HIDE_DIALOG, payload: dialogName});
export const setDialogInfo = (dialogName, info) =>
    store.dispatch({type: SET_INFO, payload: {dialogName, info}});

store.injectReducer(storeKey, (state = {}, {type, payload}) =>
    reducers[type] ? reducers[type](state, payload) : state
);

// -- hooks
export const useDialogState = (dialogName) => {
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state[dialogName];
};