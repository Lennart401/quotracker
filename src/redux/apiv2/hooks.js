import { getState, subscribe } from "../helpers";
import { apiv2StoreKey } from "./core";
import { useEffect, useLayoutEffect, useState } from "react";
import { endpoints, poll } from "./polling";

const useGeneral = (func) => {
    const [state, setState] = useState(getState(apiv2StoreKey));
    useLayoutEffect(() => subscribe(apiv2StoreKey, setState), [setState]);
    return func(state);
};

export const getStateOnce = () => {
    return getState(apiv2StoreKey);
}

/**
 * Intended for all-targets-page. Provides a list of targets.
 *
 * Uses
 * GET /targets         (sync every 30s)
 * GET /target/{}/users (sync when update)
 */
export const useTargets = () => {
    useEffect(() => poll([
        endpoints.GET.TARGETS
    ], {
        interval: 30
    }), [])
    return useGeneral((state) => state);
};

/**
 * Intended for overview-page. Provides all information for a single target.
 *
 * Uses
 * GET /target/{}/info   (sync every 30s)
 * GET /target/{}/users  (sync every 30s)
 * GET /target/{}/quotes (sync every 30s)
 * GET /target/{}/stats  (sync every 30s)
 * @param {string} targetId the id of the target to retrieve information for.
 */
export const useOverview = (targetId) => {
    useEffect(() =>
        poll([
            endpoints.GET.TARGET_id_INFO,
            endpoints.GET.TARGET_id_USERS,
            endpoints.GET.TARGET_id_QUOTES,
            endpoints.GET.TARGET_id_STATS
        ], {
            interval: 30,
            targetId: targetId
        }), [targetId]);
    return useGeneral((state) => state[targetId]);
};

/**
 * Intended for insert-page. Provides quotes and stats for a single target
 * (only for the current day for now).
 *
 * Uses
 * GET /target/{}/quotes (sync every 30s)
 * GET /target/{}/stats  (sync every 10s)
 * @param {string} targetId the id of the target to retrieve information for.
 */
export const useStats = (targetId) => {
    useEffect(() => {
        const quotesUnsub = poll([endpoints.GET.TARGET_id_QUOTES], {interval: 30, targetId: targetId});
        const statsUnsub = poll([endpoints.GET.TARGET_id_STATS], {interval: 10, targetId: targetId});
        return () => {
            quotesUnsub();
            statsUnsub();
        };
    }, [targetId]);

    // @TODO possibly implement some kind of caching here
    const fromStore = useGeneral((state) => state[targetId])
    let quotesWithStats = {};
    if (fromStore?.stats && fromStore?.quotes) {
        // @TODO make this use all possible stats (today, full, ...)
        for (let [key, value] of Object.entries(fromStore.stats.today)) {
            quotesWithStats[key] = {
                text: fromStore.quotes[key].text,
                count: value
            };
        }
    }
    return {today: quotesWithStats};
};

/**
 * Intended for all situations, where just the users are required (i.e. for permissions).
 *
 * Uses
 * GET /target/{}/users (sync every 30s)
 * @param {string} targetId the id of the target to retrieve information for.
 */
export const useUsers = (targetId) => {
    useEffect(() => poll([
        endpoints.GET.TARGET_id_USERS
    ], {
        interval: 30,
        targetId: targetId
    }), [targetId]);
    return useGeneral((state) => state[targetId]?.users);
};
// @param {{owner: {}, guests: []}} targetId

/**
 * Intended for quotes-page. Provides the list of quotes for a single target.
 *
 * Uses
 * GET /target/{}/quotes (sync every 15s)
 * @param {string} targetId the id of the target to retrieve information for.
 * @param {number|undefined} interval
 */
export const useQuotes = (targetId, interval = 15) => {
    useEffect(() => poll([
        endpoints.GET.TARGET_id_QUOTES
    ], {
        interval: interval,
        targetId: targetId
    }), [interval, targetId]);
    return useGeneral((state) => state[targetId]?.quotes);
};

/**
 * Intended for stats-page. Provides the full list of records from all quotes of a single target.
 *
 * Uses
 * GET /target/{}/records (sync every 10s)
 * @param {string} targetId the id of the target to retrieve information for.
 */
export const useRecords = (targetId) => {
    useEffect(() => poll([
        endpoints.GET.TARGET_id_RECORDS
    ], {
        interval: 10,
        targetId: targetId
    }), [targetId]);
    return useGeneral((state) => state[targetId]?.records);
};