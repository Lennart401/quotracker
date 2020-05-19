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
axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:8080/api/v2" : "http://localhost:8080:/api/v2";
axios.defaults.timeout = 5000;

const DISABLE_SERVER_ACCESS = false;

/**
 * @typedef Endpoint
 * @type {object}
 * @property {function({string}): string} url
 * @property {function(object, ?string)} handler
 * @property {?function({string}): boolean} shouldShowLoading
 */

export const endpoints = {
    GET: {
        /** @type Endpoint */
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
        /** @type Endpoint */
        TARGET_id_INFO: {
            url: (props) => `/target/${props.targetId}/info`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.info
        },
        /** @type Endpoint */
        TARGET_id_USERS: {
            url: (props) => `/target/${props.targetId}/users`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.users
        },
        /** @type Endpoint */
        TARGET_id_QUOTES: {
            url: (props) => `/target/${props.targetId}/quotes`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.quotes
        },
        /** @type Endpoint */
        TARGET_id_STATS: {
            url: (props) => `/target/${props.targetId}/stats`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.stats
        },
        /** @type Endpoint */
        TARGET_id_RECORDS: {
            url: (props) => `/target/${props.targetId}/records`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.records
        },
        /** @type Endpoint */
        TARGET_id_RECORDS_from_to: {
            url: (props) => `/target/${props.targetId}/records?from=${props.from}&to=${props.to}`,
            handler: (result) => {
                updateTargetsInternally(result);
            },
            shouldShowLoading: (props) => !getStateOnce()[props.targetId]?.records
        }
    },

    PATCH: {
        /** @type Endpoint */
        TARGET_id: {
            method: "patch",
            url: (props) => `/target/${props.targetId}`,
            handler: (result) => endpoints.GET.TARGET_id_INFO.handler(result)
        },
        /** @type Endpoint */
        TARGET_id_QUOTE_id: {
            method: "patch",
            url: (props) => `/target/${props.targetId}/quote/${props.quoteId}`,
            handler: (result) => endpoints.GET.TARGET_id_QUOTES.handler(result)
        },
        /** @type Endpoint */
        TARGET_id_USER_id: {
            method: "patch",
            url: (props) => `/target/${props.targetId}/user/${props.userId}`,
            handler: (result) => endpoints.GET.TARGET_id_USERS.handler(result)
        }
    },

    POST: {
        /** @type Endpoint */
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
        /** @type Endpoint */
        TARGET_id_QUOTE: {
            method: "post",
            url: (props) => `/target/${props.targetId}/quote`,
            handler: (result) => endpoints.GET.TARGET_id_QUOTES.handler(result)
        },
        /** @type Endpoint */
        TARGET_id_QUOTE_id: {
            method: "post",
            url: (props) => `/target/${props.targetId}/quote/${props.quoteId}`,
            handler: (result) => endpoints.GET.TARGET_id_STATS.handler(result)
        },
        /** @type Endpoint */
        TARGET_id_USER: {
            method: "post",
            url: (props) => `/target/${props.targetId}/user`,
            handler: (result) => endpoints.GET.TARGET_id_USERS.handler(result)
        }
    },

    DELETE: {
        /** @type Endpoint */
        TARGET_id: {
            method: "delete",
            url: (props) => `/target/${props.targetId}`,
            handler: (result) => {
                updateTargetsList(result);
            },
            shouldShowLoading: () => true
        },
        /** @type Endpoint */
        TARGET_id_QUOTE_id: {
            method: "delete",
            url: (props) => `/target/${props.targetId}/quote/${props.quoteId}`,
            handler: (result) => endpoints.GET.TARGET_id_QUOTES.handler(result)
        },
        /** @type Endpoint */
        TARGET_id_QUOTE_id_RECORD: {
            method: "delete",
            url: (props) => `/target/${props.targetId}/quote/${props.quoteId}/record`,
            handler: (result) => endpoints.GET.TARGET_id_STATS.handler(result)
        },
        /** @type Endpoint */
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
 * @param {[Endpoint]} endpoints a list of endpoints to poll
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

    log(`poll subscribe (${id}) using interval ${interval}`);

    // return unsubscribe function
    return () => {
        log(`poll unsubscribe (${id})`);
        clearInterval(id);
    };
};

/**
 * Makes a single poll request using redux-thunk.
 * @param {[Endpoint]} endpoints a list of endpoints to poll
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
                // console.log(response.data);
                log(response.status);
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
 * @param {Endpoint} endpoint either a patch, post or delete endpoint from endpoints
 * @param {{}} properties properties for the request, e.g. the targetId, request-body
 * @param {function(string)} callback
 */
export const makeRequest = (endpoint, properties, callback = null) => {
    if (DISABLE_SERVER_ACCESS) return;

    store.dispatch(async (dispatch) => {
        if (endpoint.shouldShowLoading && endpoint.shouldShowLoading(properties))
            showLoadingBar();

        const token = await getTokenOnce();

        log(endpoint.method);
        log(endpoint.url(properties));
        log(properties.body);

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

            if (callback) callback(response.data.status);

            log(response.status);
            log(response.data);
            hideLoadingBar();
        })
        .catch((error) => {
            if (callback) callback(error.response?.data?.status);
            handleError(error);
            hideLoadingBar();
        });
    });
};

const handleError = (error) => {
    log("ERROR"); // @TODO remove this bit
    log(error);
    log(JSON.stringify(error.response));

    if (error.response?.data?.status) {
        let textError = errorLookup[error.response.data.status];
        setErrorMessage( textError ? textError : `Unbekannter Fehler: ${error.response.data.status}`);
    } else {
        setErrorMessage("Es ist ein unbekannter Fehler aufgetreten");
    }
};

const isDevelopment = process.env.NODE_ENV === "development";
const log = (message) => {
    if (isDevelopment && false) {
        console.log(message);
    }
};