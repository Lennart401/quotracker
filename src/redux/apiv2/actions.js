import { store } from "../store";
import { features } from "./core";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { endpoints, makeRequest } from "./polling";

// ---------------------------------- //
// DIRECTLY MODIFIING ACTIONS         //
// ---------------------------------- //

// PRIMARILY USED BY RESULTS OF API-CALLS

/**
 * Updates the targets list, as specified by the action MERGE_REPLACE_SHALLOW. This means it keeps internal attributes
 * of the existing targets (and overrides them if new attributes are provided), but will only keep the targets that are
 * also specified in the argument targets.
 * Use when replacing the full list of targets.
 */
export const updateTargetsList = (targets) => {
    store.dispatch({type: features.MERGE_REPLACE_SHALLOW, payload: targets});
};

/**
 * Updates all targets internally, keeping all existing attributes and targets, even if they are not in the provided
 * argument targets.
 * Use when only replacing information in a single target or adding a single target.
 */
export const updateTargetsInternally = (targets) => {
    store.dispatch({type: features.MERGE_REPLACE_DEEP_ONLY, payload: targets});
};

// ---------------------------------- //
// IMPLIED MODIFIING ACTIONS          //
// ---------------------------------- //

// CREATE/POST

export const createTarget = ({title, description}) => {
    const current = moment().format();
    const uuid = uuidv4();
    updateTargetsInternally({
        [uuid]: {
            info: {
                owner: "Laden...",
                title: title,
                description: description,
                createdOn: current,
                lastVisited: current
            },
            // users: {
            //     owner: {
            //         id: "Laden...",
            //         name: "Laden...",
            //     },
            //     guests: []
            // }
        }
    });

    makeRequest(endpoints.POST.TARGET, {
        body: {
            "title": title,
            "description": description
        }
    });
};

export const createQuote = (targetId, text) => {
    const current = moment();
    const millis = current.valueOf();

    store.dispatch({
        type: features.MERGE_QUOTES, payload: {
            targetId,
            quotes: {
                [millis]: {
                    "text": text,
                    "createdOn": current.format()
                }
            }
        }
    });

    // store.dispatch({
    //     type: features.MERGE_STATS, payload: {
    //         targetId,
    //         stats: {
    //             "today": {
    //                 [millis]: 0
    //             },
    //             "full": {
    //                 [millis]: 0
    //             }
    //         }
    //     }
    // });

    makeRequest(endpoints.POST.TARGET_id_QUOTE, {
        targetId: targetId,
        body: {
            "text": text
        }
    });
};

export const createRecord = (targetId, quoteId) => {
    store.dispatch({
        type: features.INCREASE_STATS, payload: {
            targetId,
            quoteId
        }
    });

    makeRequest(endpoints.POST.TARGET_id_QUOTE_id, {
        targetId: targetId,
        quoteId: quoteId
    });
};

export const addUser = (targetId, {userId, canSubmitRecords, canEdit}) => {

};

// UPDATE/PATCH

export const updateTarget = (targetId, {title, description}) => {
    store.dispatch({
        type: features.MERGE_INFO, payload: {
            targetId: targetId,
            info: {
                title: title,
                description: description
            }
        }
    });

    makeRequest(endpoints.PATCH.TARGET_id, {
        targetId: targetId,
        body: {
            "title": title,
            "description": description
        }
    });
};

export const updateQuote = (targetId, quoteId, text) => {
    store.dispatch({
        type: features.MERGE_QUOTES, payload: {
            targetId,
            quotes: {
                [quoteId]: {
                    "text": text
                }
            }
        }
    });

    makeRequest(endpoints.PATCH.TARGET_id_QUOTE_id, {
        targetId: targetId,
        quoteId: quoteId,
        body: {
            "text": text
        }
    });
};

export const updateUser = (targetId, {userId, canSubmitRecords, canEdit}) => {

};

// DELETE

export const deleteTarget = (targetId) => {
    store.dispatch({
        type: features.FILTER_OUT_TARGET, payload: targetId
    });

    makeRequest(endpoints.DELETE.TARGET_id, {
        targetId: targetId
    });
};

export const deleteQuote = (targetId, quoteId) => {
    store.dispatch({
        type: features.FILTER_OUT_QUOTE, payload: {
            targetId,
            quoteId
        }
    });

    makeRequest(endpoints.DELETE.TARGET_id_QUOTE_id, {
        targetId: targetId,
        quoteId: quoteId
    });
};

export const deleteLatestRecord = (targetId, quoteId) => {
    store.dispatch({
        type: features.DECREASE_STATS, payload: {
            targetId,
            quoteId
        }
    });

    makeRequest(endpoints.DELETE.TARGET_id_QUOTE_id_RECORD, {
        targetId: targetId,
        quoteId: quoteId
    });
}

export const removeUser = (targetId, userId) => {

}