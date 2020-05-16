import { updateTargetsInternally, updateTargetsList } from "./actions";
import { setImmediateInterval } from "../store/helpers";
import { store } from "../store/store";
import axios from "axios";
import { getTokenOnce } from "../authentication";
import { setErrorMessage } from "../error-message";
import { errorLookup } from "./error-lookup";
import { hideLoadingBar, showLoadingBar } from "../loading-helper";
import { getStateOnce } from "./hooks";

// axios.defaults.proxy.host = "http://localhost";
// axios.defaults.proxy.post = 8080;
axios.defaults.baseURL = "http://localhost:8080/api/v2";
axios.defaults.timeout = 5000;

const DISABLE_SERVER_ACCESS = true;

export const endpoints = {
    GET: {
        TARGETS: {
            url: () => "/targets",
            handler: (result) => {
                updateTargetsList(result);
                let eps = [];
                let properties = [];
                for (let [key] of Object.entries(result)) {
                    eps.push(endpoints.GET.TARGET_id_USERS);
                    properties.push({targetId: key});
                }
                oneTimePoll(eps, properties);
            },
            shouldShowLoading: (props) => Object.entries(getStateOnce()) <= 1

        },
        TARGET_id_INFO: {
            url: (props) => `/target/${props.targetId}/info`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.info
        },
        TARGET_id_USERS: {
            url: (props) => `/target/${props.targetId}/users`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.users
        },
        TARGET_id_QUOTES: {
            url: (props) => `/target/${props.targetId}/quotes`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.quotes
        },
        TARGET_id_STATS: {
            url: (props) => `/target/${props.targetId}/stats`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.stats
        },
        TARGET_id_RECORDS: {
            url: (props) => `/target/${props.targetId}/records`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.records
        },
        TARGET_id_RECORDS_from_to: {
            url: (props) => `/target/${props.targetId}/records?from=${props.from}&to=${props.to}`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.records
        }
    },

    PATCH: {
        TARGET_id: {
            method: "patch",
            url: (props) => `/target/${props.targetId}`,
            handler: (result) => endpoints.GET.TARGET_id_INFO.handler(result)
        },
        TARGET_id_QUOTE_id: {
            method: "patch",
            url: (props) => `/target/${props.targetId}/quote/${props.quoteId}`,
            handler: (result) => endpoints.GET.TARGET_id_QUOTES.handler(result)
        },
        TARGET_id_USER_id: {
            method: "patch",
            url: (props) => `/target/${props.targetId}/user/${props.userId}`,
            handler: (result) => endpoints.GET.TARGET_id_USERS.handler(result)
        }
    },

    POST: {
        TARGET: {
            method: "post",
            url: () => `/target`,
            handler: (result, id) => {
                endpoints.GET.TARGET_id_INFO.handler(result);
                oneTimePoll([
                    endpoints.GET.TARGET_id_USERS
                ], {
                    targetId: id
                });
            },
            shouldShowLoading: () => true
        },
        TARGET_id_QUOTE: {
            method: "post",
            url: (props) => `/target/${props.targetId}/quote`,
            handler: (result) => endpoints.GET.TARGET_id_QUOTES.handler(result)
        },
        TARGET_id_QUOTE_id: {
            method: "post",
            url: (props) => `/target/${props.targetId}/quote/${props.quoteId}`,
            handler: (result) => endpoints.GET.TARGET_id_STATS.handler(result)
        },
        TARGET_id_USER: {
            method: "post",
            url: (props) => `/target/${props.targetId}/user`,
            handler: (result) => endpoints.GET.TARGET_id_USERS.handler(result)
        }
    },

    DELETE: {
        TARGET_id: {
            method: "delete",
            url: (props) => `/target/${props.targetId}`,
            handler: (result) => {
                updateTargetsList(result);
            },
            shouldShowLoading: () => true
        },
        TARGET_id_QUOTE_id: {
            method: "delete",
            url: (props) => `/target/${props.targetId}/quote/${props.quoteId}`,
            handler: (result) => endpoints.GET.TARGET_id_QUOTES.handler(result)
        },
        TARGET_id_QUOTE_id_RECORD: {
            method: "delete",
            url: (props) => `/target/${props.targetId}/quote/${props.quoteId}/record`,
            handler: (result) => endpoints.GET.TARGET_id_STATS.handler(result)
        },
        TARGET_id_USER_id: {
            method: "delete",
            url: (props) => `/target/${props.targetId}/user/${props.userId}`,
            handler: (result) => endpoints.GET.TARGET_id_USERS.handler(result)
        }
    }
};

/**
 * Subscribe to make poll requests in regular intervals. Use with useEffect()-hook.
 * Returns function to unsubscribe.
 * @param {[{url: (function({}): {string}), handler: (function({}))}]} endpoints a list of endpoints to poll
 * @param {{interval: {number}}|[{interval: {number}}]} properties one properties-object for all requests or seperate
 *                                                      ones for each request. interval should be provided in seconds.
 *                                                      if array, only the first interval will be taken into account.
 * @returns {function(...[*]=)} unsubscribe function
 */
export const poll = (endpoints, properties) => {
    let interval = Array.isArray(properties) ? properties[0].interval : properties?.interval;

    if (!interval || interval < 5) {
        interval = 100;
    }

    const id = setImmediateInterval(() => {
        oneTimePoll(endpoints, properties);
    }, interval * 1000);

    console.log(`poll subscribe (${id}) using interval ${interval}`);

    // return unsubscribe function
    return () => {
        console.log(`poll unsubscribe (${id})`);
        clearInterval(id);
    };
};

/**
 * Makes a single poll request using redux-thunk.
 * @param {[{url: (function({}): {string}), handler: (function({}))}]} endpoints a list of endpoints to poll
 * @param {{}|[]} properties one properties-object for all requests or seperate ones for each request.
 */
export const oneTimePoll = (endpoints, properties) => {
    if (DISABLE_SERVER_ACCESS) return;

    store.dispatch(async (dispatch) => {
        const isPropertiesAnArray = Array.isArray(properties);

        let displayLoadingBar = false;
        endpoints.forEach((endpoint, index) => {
            displayLoadingBar = displayLoadingBar ||
                (endpoint.shouldShowLoading
                    && endpoint.shouldShowLoading(isPropertiesAnArray ? properties[index] : properties))
        });

        if (displayLoadingBar) showLoadingBar();

        const token = await getTokenOnce();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        const requests = isPropertiesAnArray
            ? endpoints.map((ep, index) => axios.get(ep.url(properties[index]), config))
            : endpoints.map((ep) => axios.get(ep.url(properties), config));

        axios.all(requests)
        .then(axios.spread((...responses) => {
            responses.forEach((response, index) => {
                endpoints[index].handler(response.data.data)

                // console.log(endpoints[index]);
                // console.log(response.statusText);
                // console.log(response.headers);
                // console.log(response.config);
                console.log(response.data);
                console.log(response.status);
            });
            hideLoadingBar();
        }))
        .catch(error => {
            handleError(error);
            hideLoadingBar();
            // if (error.response?.data?.status) {
            //     let textError = errorLookup[error.response.data.status];
            //     setErrorMessage( textError ? textError : `Unbekannter Fehler: ${error.response.data.status}`);
            // } else {
            //     setErrorMessage("Es ist ein unbekannter Fehler aufgetreten");
            // }
        });
    });
}

/**
 * Sends a request to the server and awaits its answer, which will be merged into the targets
 * @param {{method: {string}, url: (function({}): {string}), handler: (function({})|function({}, {string}))}} endpoint either a patch, post or delete endpoint from endpoints
 * @param {{}} properties properties for the request, e.g. the targetId, request-body
 */
export const makeRequest = (endpoint, properties) => {
    if (DISABLE_SERVER_ACCESS) return;

    store.dispatch(async (dispatch) => {
        if (endpoint.shouldShowLoading && endpoint.shouldShowLoading(properties))
            showLoadingBar();

        const token = await getTokenOnce();

        console.log(endpoint.method);
        console.log(endpoint.url(properties));
        console.log(properties.body);

        axios({
            method: endpoint.method,
            url: endpoint.url(properties),
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                ...properties.body
            },
        })
        .then((response) => {
            if (endpoint.method === "post") {
                endpoint.handler(response.data.data, response.data.id);
            } else {
                endpoint.handler(response.data.data);
            }

            console.log(response.status);
            console.log(response.data);
            hideLoadingBar();
        })
        .catch((error) => {
            handleError(error);
            hideLoadingBar();
        });
    });
};

const handleError = (error) => {
    console.log("ERROR"); // @TODO remove this bit
    console.log(error);
    console.log(JSON.stringify(error.response));

    if (error.response?.data?.status) {
        let textError = errorLookup[error.response.data.status];
        setErrorMessage( textError ? textError : `Unbekannter Fehler: ${error.response.data.status}`);
    } else {
        setErrorMessage("Es ist ein unbekannter Fehler aufgetreten");
    }
};