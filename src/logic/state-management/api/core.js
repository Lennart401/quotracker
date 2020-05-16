import { store } from "../store/store";
import { getTestInitialState, makeActionName } from "../store/helpers";
import produce from "immer";

const initialState = getTestInitialState();//{};
export const apiv2StoreKey = "apiv2";

export const features = {
    /**
     * Keeps deep values, but gets rid of any shallow keys (first level) that are not delivered.
     * It other words, it replaces the (list of) shallow keys, but keeps deep keys for all those shallow keys,
     * which are included in the delivered information.
     */
    MERGE_REPLACE_SHALLOW: makeActionName(apiv2StoreKey, "mergeTargets"),
    /** Keeps shallow and deep values and replaces those which have been (re-)delivered */
    MERGE_REPLACE_DEEP_ONLY: makeActionName(apiv2StoreKey, "mergeOnTarget"),

    /** Merges the guest users */
    MERGE_INFO: makeActionName(apiv2StoreKey, "mergeInfo"),
    MERGE_USERS: makeActionName(apiv2StoreKey, "mergeUsers"),
    MERGE_QUOTES: makeActionName(apiv2StoreKey, "mergeQuotes"),
    MERGE_STATS: makeActionName(apiv2StoreKey, "mergeStats"),

    INCREASE_STATS: makeActionName(apiv2StoreKey, "increateStats"),
    /** Caution! This can make the stat go below 0! */
    DECREASE_STATS: makeActionName(apiv2StoreKey, "decreaseStats"),
    FILTER_OUT_TARGET: makeActionName(apiv2StoreKey, "filterOutTarget"),
    FILTER_OUT_USER: makeActionName(apiv2StoreKey, "filterOutUser"),
    FILTER_OUT_QUOTE: makeActionName(apiv2StoreKey, "filterOutQuote"),
};

const reducers = {
    // DIRECTLY MODIFIING ACTIONS
    [features.MERGE_REPLACE_SHALLOW]: (state, targets) => mergeReplaceShallow(state, targets),
    [features.MERGE_REPLACE_DEEP_ONLY]: (state, targets) => produce(state, draft => {
        for (let [key, value] of Object.entries(targets)) {
            draft[key] = {...state[key], ...value};
        }
    }),

    // DEEP MODIFIING ACTIONS // these require the keys to be existing already
    [features.MERGE_INFO]: (state, {targetId, info}) => produce(state, draft => {
        draft[targetId].info = {...draft[targetId]?.info, ...info};
    }),
    [features.MERGE_USERS]: (state, {targetId, user}) => produce(state, draft => {
        let index = draft[targetId].users.guests.findIndex(item => item.id === user.id)
        if (index >= 0) {
            draft[targetId].users.guests[index] = {...draft[targetId].users.guests[index], ...user};
        } else {
            draft[targetId].users.guests.push(user);
        }
    }),
    [features.MERGE_QUOTES]: (state, {targetId, quotes}) => produce(state, draft => {
        if (!draft[targetId].quotes) {
            draft[targetId].quotes = {};
        }

        for (let [id, value] of Object.entries(quotes)) {
            draft[targetId].quotes[id] = {...draft[targetId].quotes[id], ...value};
        }
    }),
    [features.MERGE_STATS]: (state, {targetId, stats}) => produce(state, draft => {
        if (!draft[targetId].stats) {
            draft[targetId].stats = {}
        }
        for (let [timeframe, newState] of Object.entries(stats)) {
            draft[targetId].stats[timeframe] = {...draft[targetId].stats[timeframe], ...newState}
        }
    }),

    // SPECIAL ACTIONS
    [features.INCREASE_STATS]: (state, {targetId, quoteId}) => produce(state, draft => {
        for (let [timeframe] of Object.entries(draft[targetId].stats)) {
            draft[targetId].stats[timeframe][quoteId] += 1;
        }
    }),
    [features.DECREASE_STATS]: (state, {targetId, quoteId}) => produce(state, draft => {
        if (findLowestStat(draft[targetId].stats, quoteId) !== 0) {
            for (let [timeframe] of Object.entries(draft[targetId].stats)) {
                draft[targetId].stats[timeframe][quoteId] -= 1;
            }
        }
    }),

    [features.FILTER_OUT_TARGET]: (state, targetId) => produce(state, draft => {
        delete draft[targetId];
    }),
    [features.FILTER_OUT_QUOTE]: (state, {targetId, quoteId}) => produce(state, draft => {
        // draft[targetId].quotes = Object.keys(draft[targetId].quotes).filter(key => key !== quoteId).reduce((obj, key) => {
        //     obj[key] = draft[targetId].quotes[key];
        //     return obj;
        // }, {});
        delete draft[targetId].quotes[quoteId];

        if (draft[targetId].stats) {
            for (let [timeframe] of Object.entries(draft[targetId].stats)) {
                delete draft[targetId].stats[timeframe][quoteId];
            }
        }
    })
};

const mergeReplaceShallow = (state, targets) => {
    const merge = {};
    for (let [key, value] of Object.entries(targets)) {
        merge[key] = {...state[key], ...value};
    }
    return merge;
};

const findLowestStat = (stats, quoteId) => {
    let lowest = Number.MAX_SAFE_INTEGER;
    for (let [timeframe] of Object.entries(stats)) {
        if (stats[timeframe][quoteId] < lowest) {
            lowest = stats[timeframe][quoteId];
        }
    }
    return lowest;
}

store.injectReducer(apiv2StoreKey, (state = initialState, {type, payload}) =>
    reducers[type] ? reducers[type](state, payload) : state
);

// export const newCoreTest = () => {
//     const myState = {
//         "Nummer1": {
//             "title": "Das erste.",
//             "quotes": {
//                 "1": {
//                     "text": "Hallo"
//                 }
//             }
//         },
//         "Nummer3": {
//             "title": "das dritte"
//         }
//     };
//
//     const loaded = {
//         "Nummer1": {
//             "quotes": {
//                 "2": {
//                     "text": "HALLO HIER"
//                 }
//             }
//         },
//         "Nummer2": {
//             "title": "Irgendwas"
//         }
//     };
//
//     const merge = produce(myState, draft => {
//         for (let [key, value] of Object.entries(loaded)) {
//             draft[key] = { ...myState[key], ...value };
//         }
//     })
//     console.log("merge");
//     console.log(merge);
//
//     const merge2 = {};
//     for (let [key, value] of Object.entries(loaded)) {
//         merge2[key] = { ...myState[key], ...value };
//     }
//
//     console.log("merge2");
//     console.log(merge2);
// };
