import { useAuth0 } from "../react-auth0-spa";
import { useEffect } from "react";
import { apiServerUrl } from "../redux/helpers";
import { getHandleErrors } from "./global-fetch";

const urlGetAlltargets = `${apiServerUrl}/api/v1/alltargets`;
const urlGetDetails = (targetId) => `${apiServerUrl}/api/v1/target/${targetId}/details`;
const urlGetStats = (targetId) => `${apiServerUrl}/api/v1/target/${targetId}/stats`;

/**
 * Returns a function that will fetch all targets from the server and call successCallback with the result. If it fails
 * to fetch, it will call failureCallback.
 *
 * <b>CAUTION!!!</b> This function create a NEW function on every call, in order to
 * use with useSynchronization it needs to be wrapped in useCallback(synchronizeLoadTargets(...), [...]), or you will
 * end up in an inifite refetching loop.
 * @param successCallback the function to call when the data has been successfully fetched. Will receive the fetching-result
 * @param failureCallback this will be called in case of failing to fetch the data
 * @returns {function(): Promise<void>}
 */
export const synchronizeLoadTargets = (successCallback, failureCallback) => {
    return () => getHandleErrors(urlGetAlltargets, successCallback, failureCallback);
};

/**
 * Returns a function that will fetch details for one target (the target with the given targetId) from the server and
 * call successCallback if successful. The result of the fetch will be passed as a parameter. If the fetch fails,
 * failureCallback will be called with an error object.
 *
 * <b>CAUTION!!!</b> This function create a NEW function on every call, in order to
 * use with useSynchronization it needs to be wrapped in useCallback(synchronizeLoadTargets(...), [...]), or you will
 * end up in an inifite refetching loop.
 * @param targetId the id of the target to get the details for
 * @param successCallback the function to call when the data has been successfully fetched. Will receive the fetching-result
 * @param failureCallback this will be called in case of failing to fetch the data
 * @returns {function(): Promise<void>}
 */
export const synchronizeLoadTargetDetails = (targetId, successCallback, failureCallback) => {
    return () => getHandleErrors(urlGetDetails(targetId), successCallback, failureCallback);
};

/**
 * Returns a function that will fetch the stats for one target (the target with the given targetId) from the server and
 * call successCallback if successful. The result of the fetch will be passed as a parameter. If the fetch fails,
 * failureCallback will be called with an error object.
 *
 * <b>CAUTION!!!</b> This function create a NEW function on every call, in order to
 * use with useSynchronization it needs to be wrapped in useCallback(synchronizeLoadTargets(...), [...]), or you will
 * end up in an inifite refetching loop.
 * @param targetId the id of the target to get the details for
 * @param successCallback the function to call when the data has been successfully fetched. Will receive the fetching-result
 * @param failureCallback this will be called in case of failing to fetch the data
 * @returns {function(): Promise<void>}
 */
export const synchronizeLoadTargetStats = (targetId, successCallback, failureCallback) => {
    return () => getHandleErrors(urlGetStats(targetId), successCallback, failureCallback);
}

// @TODO (SYNC) make this proper synchronization -> subscribe to the server and receive updates, so the local state will always kept in sync
/**
 * Needs the action to be a non-changing function (nor created everytime useSynchronization is called). If nothing else
 * helps, wrap the function in <b>useCallback(func, deps)</b>. This will prevent an infinite refetching loop.
 * @param action a non-changing function that handles the data fetching
 */
export const useSynchronization = (action) => {
    console.log("   useSynchronization");
    const {loading} = useAuth0();
    useEffect(() => { // @TODO find out why fetching is always being done TWICE?!?! but only when loading the page for the first time
        console.log(`useEffect ${action}`);
        if (!loading)
            action();
    }, [loading, action]);
}
