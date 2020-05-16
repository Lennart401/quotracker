import { setErrorMessage } from "../redux/error-message";
import { getTokenOnce } from "../redux/authentication";
import { hideLoadingBar, showLoadingBar } from "../redux/loading-helper";

export const getHandleErrors = async (url, successCallback, failureCallback) => {
    console.log("getHandleErrors " + url);
    showLoadingBar();

    const token = await getTokenOnce();
    console.log(token);

    // @TODO what happens with "failed to fetch" --> right now, it'll go into an infinite refetching loop
    fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) return response.json();
        else throw new Error(`Promise not ok with status code ${response.status}.`);
    }).then((json) => {
        hideLoadingBar();
        successCallback(json);
    }).catch((error) => {
        hideLoadingBar();
        // @TODO remove failureCallback check and completely move to only using the failureCallback
        if (failureCallback) failureCallback(error);
        else setErrorMessage(JSON.stringify(error.message));
    });
}

export const postHandleErrors = async (url, callback, body = "") => {
    console.log("postHandleErrors " + url);
    const token = await getTokenOnce();

    fetch(url, {
        method: "post",
        body: body,
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.ok) return response.json();
        else throw new Error(`Promise not ok with status code ${response.status}.`);
    }).then((json) => {
        callback(json);
    }).catch((error) => {
        setErrorMessage(JSON.stringify(error.message));
    });
}
