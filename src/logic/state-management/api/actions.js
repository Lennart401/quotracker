import { store } from "../store/store";
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

// export const addUserLocally = (targetId, {userId, email, canSubmitRecords, canEdit}) => {
//     store.dispatch({
//         type: features.MERGE_USERS, payload: {
//             targetId: targetId,
//             user: {
//                 id: userId,
//                 name: email,
//                 canSubmitRecords: canSubmitRecords,
//                 canEdit: canEdit
//             }
//         }
//     });
// };

/**
 * @param {string} targetId
 * @param {{email: string, canSubmitRecords: boolean, canEdit: boolean}} user
 * @param {function(string)} callback
 */
export const tryAddUser = (targetId, user, callback) => {
    makeRequest(endpoints.POST.TARGET_id_USER, {
        targetId: targetId,
        body: {
            ...user
        }
    }, callback);
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

/**
 * @param {string} targetId
 * @param {{id: string, canSubmitRecords: boolean, canEdit: boolean}} user
 */
export const updateUser = (targetId, user) => {
    store.dispatch({
        type: features.MERGE_USERS, payload: {
            targetId: targetId,
            user: user
        }
    });

    makeRequest(endpoints.PATCH.TARGET_id_USER_id, {
        targetId: targetId,
        userId: user.id,
        body: {
            canSubmitRecords: user.canSubmitRecords,
            canEdit: user.canEdit
        }
    })
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
    store.dispatch({
        type: features.FILTER_OUT_USER, payload: {
            targetId: targetId,
            userId: userId
        }
    });

    makeRequest(endpoints.DELETE.TARGET_id_USER_id, {
        targetId: targetId,
        userId: userId
    })
}