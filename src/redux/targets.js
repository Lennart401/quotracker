import { useCallback, useLayoutEffect, useState } from "react";
import { apiServerUrl, getState, makeActionName, subscribe } from "./helpers";
import { store } from "./store";
import { postHandleErrors } from "../api/global-fetch";
import {
    synchronizeLoadTargetDetails,
    synchronizeLoadTargets,
    synchronizeLoadTargetStats,
    useSynchronization
} from "../api/synchronization";
import { defaultFailureCallback } from "./error-message";

const storeKey = "targets";

// DEFINITIONS
const urlPostNewRecord = (targetId, quoteId) => `${apiServerUrl}/api/v1/target/${targetId}/quote/${quoteId}/newrecord`;
const urlPostNewQuote = (targetId) => `${apiServerUrl}/api/v1/target/${targetId}/newquote`;
const urlPostDeleteQuote = (targetId, quoteId) => `${apiServerUrl}/api/v1/target/${targetId}/quote/${quoteId}/delete`;
const urlPostDeleteLatestRecord = (targetId, quoteId) => `${apiServerUrl}/api/v1/target/${targetId}/quote/${quoteId}/records/delete`;

const initialState = {
    fetched: false,
    list: []
};

const ADD_ITEM = makeActionName(storeKey, "addItem");
const ADD_ITEMS = makeActionName(storeKey, "addItems");
const DELETE_ITEM = makeActionName(storeKey, "deleteItem");
const REPLACE_ITEMS = makeActionName(storeKey, "replaceItems");
const UPDATE_ITEMS = makeActionName(storeKey, "updateItems");
const UPDATE_STATS = makeActionName(storeKey, "updateStats");
const ADD_QUOTE = makeActionName(storeKey, "addQuote");

const CREATE_QUOTE_RECORD = makeActionName(storeKey, "createQuoteRecord");
const DELETE_QUOTE = makeActionName(storeKey, "deleteQuote");
const DELETE_LATEST_RECORD = makeActionName(storeKey, "deleteLatestRecord");

// noinspection JSUnusedGlobalSymbols
const reducers = {
    // arguments: (state destructured into list and rest of state, payload)
    // all "getters"
    [ADD_ITEM]: ({list, ...state}, item) => returnWithList(state, [...list, item]),
    [ADD_ITEMS]: ({list, ...state}, items) => returnWithList(state, [...list, ...items]),
    [DELETE_ITEM]: ({list, ...state}, targetItem) => returnWithList(state, list.filter(item => item.id !== targetItem.id)),
    [REPLACE_ITEMS]: ({list, ...state}, items) => returnWithList(state, [...items]),
    [UPDATE_ITEMS]: ({list, ...state}, items) => returnWithList(state, mergeWithList(list, items)),
    [UPDATE_STATS]: ({list, ...state}, {targetId, stats}) => returnWithList(state, mergeStatsWithList(list, targetId, stats)),
    [ADD_QUOTE]: ({list, ...state}, {targetId, quoteText}) => returnWithList(state, insertNewQuote(list, targetId, quoteText)),

    // all "setters"
    [CREATE_QUOTE_RECORD]: ({list, ...state}, {targetId, quoteId}) => returnWithList(state, insertNewRecord(list, targetId, quoteId)),
    [DELETE_QUOTE]: ({list, ...state}, {targetId, quoteId}) => returnWithList(state, deleteQuoteFromList(list, targetId, quoteId)),
    [DELETE_LATEST_RECORD]: ({list, ...state}, {targetId, quoteId}) => returnWithList(state, deleteLatestRecordFromList(list, targetId, quoteId)),
};

// HELPERS
/**
 * Helper function that will take the rest of the state and a list and then return an object containing all fields
 * of the state and a field called "list" with the parameter list (object.list = list)
 * @param state the rest of the state
 * @param list the list of set the field "list" to
 * @returns {{list: []}} a state object
 */
const returnWithList = (state, list) => ({...state, list: list});

/**
 * This function takes both the existing list and a some type of item(s) to merge with the existing list. Items will
 * be matched on the "id"-field. Provides two different actions:
 * 1. merge list with items by keeping all existing fields in the list but updating and/or adding those which have
 * changed/been added in items
 * 2. merge a detail-object (identified by object.info beeing one of the root objects of the list) with an existing
 * object in the list, or completely adding the object if it is not yet present in the list
 * @param list the original list which shall be updated
 * @param items the new(er) items or a details item
 * @returns {[]} the fully merged list
 */
const mergeWithList = (list, items) => { // @TODO evaluate if elvis operator can make this easier
    let newList = Object.assign([], list);
    if (items.info) {
        const newItem = {
            ...items.info,
            users: [items.users.owner, ...items.users.guests],
            quotesSummarized: items.quotesSummarized,
            stats: items.stats
        };
        const index = newList.findIndex(elem => elem.id === newItem.id);
        if (index !== -1) newList[index] = newItem;
        else newList.push(newItem);
    } else {
        items.forEach(item => {
            const index = newList.findIndex(elem => elem.id === item.id);
            if (index !== -1) {
                let currentItem = newList[index];
                const newItem = {...item}
                if (currentItem.users) newItem.users = currentItem.users;
                if (currentItem.quotesSummarized) newItem.quotesSummarized = currentItem.quotesSummarized;
                if (currentItem.stats) newItem.stats = currentItem.stats;
                newList[index] = newItem;
            } else newList.push(item);
        });
    }
    return newList;
};

/**
 * Merges the given stats with the list of targets. Either creates the target for the given targetId (if it doesn't
 * exist in the list) and adds the stats to that target, or replaces the present stats of the target with the new ones.
 * @param list list of targets to merge with
 * @param targetId the target id for which the stats shall be replaced/added
 * @param stats the stats-object
 * @returns {[]} the fully merged list
 */
const mergeStatsWithList = (list, targetId, stats) => { // @TODO evaluate if elvis operator can make this easier
    let newList = Object.assign([], list);
    const index = newList.findIndex(elem => elem.id === targetId);
    if (index !== -1) {
        newList[index].stats = stats;
    } else {
        newList.push({id: targetId, stats: stats});
    }
    return newList;
};

const insertNewQuote = (list, targetId, quoteText) => {
    let newList = Object.assign([], list);
    const target = list.find(item => item.id === targetId);
    const newQuote = {
        id: 0,
        text: quoteText,
        count: 0
    };
    if (target?.stats) {
        target.stats.today.push(newQuote);
        target.stats.full.push(newQuote);
    }
    return newList;
}

/**
 * Adds a new record to the list. Increases the count of the quoteId by 1 and the total amount of records by 1 as well.
 * @returns {[]}
 */
const insertNewRecord = (list, targetId, quoteId) => {
    let newList = Object.assign([], list);
    const target = newList.find(elem => elem.id === targetId);
    if (target) {
        if (target.quotesSummarized)
            target.quotesSummarized.totalRecords++;
        if (target.stats)
            target.stats.today.find(elem => elem.id === quoteId).count++;
    }
    return newList;
};

/**
 * Deletes the quote with the quoteId from the stats (both today and full)
 * @returns {[]}
 */
const deleteQuoteFromList = (list, targetId, quoteId) => {
    let newList = Object.assign([], list);
    const target = newList.find(elem => elem.id === targetId);
    if (target?.stats) { // @TODO maybe, if neccessary, get the count of the quote to remove and subtract that from quotesSummarized.totalRecords
        target.stats.today = target.stats.today.filter(quote => quote.id !== quoteId);
        target.stats.full = target.stats.full.filter(quote => quote.id !== quoteId);
    }
    return newList;
};

/**
 * Subtractes one from the count of the given quote(id) for the given target(id), if the count is above zero. Otherwise
 * it does nothing.
 * @returns {[]}
 */
const deleteLatestRecordFromList = (list, targetId, quoteId) => {
    let newList = Object.assign([], list);
    const target = newList.find(elem => elem.id === targetId);
    if (target?.stats) {
        const quoteToday = target.stats.today.find(quote => quote.id === quoteId);
        const quoteFull = target.stats.full.find(quote => quote.id === quoteId);

        if (quoteToday && quoteToday.count > 0) quoteToday.count--;
        if (quoteFull && quoteFull.coutn > 0) quoteToday.full--;
    }
    return newList;
};

// EXPORTS -- setters

// const addTargetItem = (item) =>
//     store.dispatch({type: ADD_ITEM, payload: item});

// const addTargetItems = (items) =>
//     store.dispatch({type: ADD_ITEMS, payload: items});

// const deleteTargetItem = (item) =>
//     store.dispatch({type: DELETE_ITEM, payload: item});

// const replaceTargetItems = (items) =>
//     store.dispatch({type: REPLACE_ITEMS, payload: items});

export const updateTargetItems = (items) => {
    store.dispatch({type: UPDATE_ITEMS, payload: items});
};

export const updateTargetStats = (targetId, stats) => {
    store.dispatch({type: UPDATE_STATS, payload: {targetId, stats}});
};

export const addQuote = (targetId, quoteText) => {
    // @TODO (SYNC) change this to only publish to the server when introducing proper synchronization, but not receive a full answer body, only a "200 OK"
    postHandleErrors(urlPostNewQuote(targetId), (result) => updateTargetStats(targetId, result), quoteText);
    store.dispatch({type: ADD_QUOTE, payload: {targetId, quoteText}});
};

export const createQuoteRecord = (targetId, quoteId) => {
    // @TODO (SYNC) change this to only publish to the server when introducing proper synchronization, but not receive a full answer body, only a "200 OK"
    postHandleErrors(urlPostNewRecord(targetId, quoteId), (result) => updateTargetStats(targetId, result))
    store.dispatch({type: CREATE_QUOTE_RECORD, payload: {targetId, quoteId}});
};

export const deleteQuote = (targetId, quoteId) => {
    // @TODO (SYNC) change this to only publish to the server when introducing proper synchronization, but not receive a full answer body, only a "200 OK"
    postHandleErrors(urlPostDeleteQuote(targetId, quoteId), (result) => updateTargetStats(targetId, result))
    store.dispatch({type: DELETE_QUOTE, payload: {targetId, quoteId}});
}

export const deleteLatestRecord = (targetId, quoteId) => {
    // @TODO (SYNC) change this to only publish to the server when introducing proper synchronization, but not receive a full answer body, only a "200 OK" (or 400 if quote is too old)
    postHandleErrors(urlPostDeleteLatestRecord(targetId, quoteId), (result) => updateTargetStats(targetId, result));
    store.dispatch({type: DELETE_LATEST_RECORD, payload: {targetId, quoteId}});
}

// inject one handle-all reducer into the store. this reducer will look for any match in reducers-list and
// if found, call the corresponding reducer
store.injectReducer(storeKey, (state = initialState, {type, payload}) =>
    reducers[type] ? reducers[type](state, payload) : state
);

// -- hooks
/**
 * Subscribes to the existing list of targets already present in cache. Will start re-fetching the list
 * from the server and update the state accordingly.
 * Errors are handled by the application-wide error handling protocol. No need to unsubscribe,
 * the hook will take care of it.
 * @returns {[]}
 */
export const useTargets = () => {
    // @TODO (SYNC) ensure this keeps working when introducing proper synchronization (the result of the called function will be captured by useEffect)
    useSynchronization(useCallback(synchronizeLoadTargets((result) => updateTargetItems(result), defaultFailureCallback), []));

    // !!!!always keep these comments, I refer to them in all other hooks in all other redux state managers!!!!

    // keep state and the store-state "storeKey" in sync
    const [state, setState] = useState(getState(storeKey));
    // immediately subscribe to the store, any changes will be represented in state (which is set using setState)
    // useLayoutEffect() will expect an unsubscribe-function, which is being delivered by the subscribe method
    // and using the array-function automatically returned
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state.list; // CAUTION when copy&paste: this function is returning a subset of storeKey-state!
};

/**
 * Subscribes to get the detailed target description for the given targetId. Will start re-fetching the target details
 * from the server and update the state accordingly.
 * @param targetId the target the detailed-information shall be delivered for
 * @returns {{}|null|undefined} the target with standard (list) information and details, or null/undefined
 * if not fetched yet
 */
export const useTargetDetail = (targetId) => {
    // @TODO (SYNC) ensure this keeps working when introducing proper synchronization (the result of the called function will be captured by useEffect)
    useSynchronization(useCallback(synchronizeLoadTargetDetails(targetId, (result) => updateTargetItems(result), defaultFailureCallback), []));

    // see comments in useTargets()
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    //return state.list ? state.list.find(target => target.id === targetId) : null;
    return state.list?.find(target => target.id === targetId);
};

// const urlGetStats = (targetId) => `${apiServerUrl}/api/v1/target/${targetId}/stats`;
/**
 * Subscribes to get only the stats of the target with the given id. Will start re-fetching the target stats
 * from the server and update the state accordingly.
 * @param targetId the id of the target to get the stats for
 * @returns {{}|undefined} the stats or undefined, if they haven't been found/loaded yet
 */
export const useStats = (targetId) => {
    // @TODO (SYNC) ensure this keeps working when introducing proper synchronization (the result of the called function will be captured by useEffect)
    console.log("   useStats");
    useSynchronization(useCallback(synchronizeLoadTargetStats(targetId, (result) => updateTargetStats(targetId, result), defaultFailureCallback), []));

    // see comments in useTargets()
    const [state, setState] = useState(getState(storeKey));
    useLayoutEffect(() => subscribe(storeKey, setState), [setState]);
    return state.list?.find(target => target.id === targetId)?.stats;
};
