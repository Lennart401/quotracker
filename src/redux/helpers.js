import { store } from "./store";

export const apiServerUrl = "http://localhost:8080";

export const getState = (storeKey) => store.getState()[storeKey];

export const subscribe = (storeKey, func) => {
    let lastState = getState(storeKey);
    return store.subscribe(() => {
        if (lastState !== getState(storeKey)) {
            lastState = getState(storeKey);
            func(lastState);
        }
    });
};

export const makeActionName = (storeKey, name) => `${storeKey}/${name}`;

export const setImmediateInterval = (func, interval) => {
    func();
    return setInterval(func, interval);
};

// export const makeActionNames = (storeKey, list) => {
//     let result = {};
//     list.forEach(item => result[item] = makeActionName(storeKey, item));
//     return result;
// };

export const getTestInitialState = () => (
    {
        "a6bf353b-b995-49ee-9725-fb2517d8d88c": {
            "info": {
                "owner": "auth0|5e91ddc85aac980bf6392cd3",
                "title": "Sloddi",
                "description": "Sloddi labert in der nächsten Version. Hat Struktur und Verhalten, wie Yin und Yang. Verstehen Sie das?",
                "createdOn": "2020-04-12T18:37:38.993+02:00",
                "lastVisited": "2020-04-12T18:37:39.013+02:00"
            },
            "users": {
                "owner": {
                    "id": "auth0|5e91ddc85aac980bf6392cd3",
                    "name": "lennart@lvideos.de"
                },
                "guests": []
            },
            "quotes": {
                "1": {
                    "text": "Verstehen Sie?",
                    "createdOn": "2020-04-12T18:40:39.023+02:00"
                },
                "2": {
                    "text": "... kennen Sie?",
                    "createdOn": "2020-04-12T20:05:39.026+02:00"
                },
                "4": {
                    "text": "Sehen Sie das?",
                    "createdOn": "2020-04-29T14:32:40.262+02:00"
                },
                "6": {
                    "text": "Did you get it?",
                    "createdOn": "2020-04-29T14:58:40.662+02:00"
                }
            },
            "stats": {
                "today": {
                    "1": 0,
                    "2": 0,
                    "4": 0,
                    "6": 0
                },
                "full": {
                    "1": 23,
                    "2": 8,
                    "4": 3,
                    "6": 2
                }
            }
        },
        "384006ad-a7ba-4aff-8fe5-7ec8c96dea60": {
            "info": {
                "owner": "auth0|5e91ddc85aac980bf6392cd3",
                "title": "Hallo hier!",
                "description": "Vielleicht kann man die Summe der Targets über ein Integral abschätzen. Das ist aber sehr schwierig, da die Primfaktoren völlig unbekannt sind",
                "createdOn": "2020-04-13T23:28:39.029+02:00",
                "lastVisited": "2020-04-13T23:28:39.032+02:00"
            },
            "users": {
                "owner": {
                    "id": "auth0|5e91ddc85aac980bf6392cd3",
                    "name": "lennart@lvideos.de"
                },
                "guests": [
                    {
                        "id": "someone",
                        "name": "someone",
                        "canSubmitRecords": true,
                        "canEdit": false
                    }
                ]
            },
            "quotes": {
                "3": {
                    "text": "Jetzt hat der Hund das schon wieder nicht gemacht",
                    "createdOn": "2020-04-13T23:31:39.034+02:00"
                }
            },
            "stats": {
                "today": {
                    "3": 0
                },
                "full": {
                    "3": 14
                }
            }
        },
        "0f0e136e-e709-4522-8ccf-e76b92b81764": {
            "info": {
                "owner": "someone",
                "title": "Wichser",
                "description": "WICHSER!!!",
                "createdOn": "2020-05-01T18:17:00.748+02:00",
                "lastVisited": "2020-05-01T18:17:00.748+02:00"
            },
            "users": {
                "owner": {
                    "id": "someone",
                    "name": "someone"
                },
                "guests": [
                    {
                        "id": "auth0|5e91ddc85aac980bf6392cd3",
                        "name": "lennart@lvideos.de",
                        "canSubmitRecords": true,
                        "canEdit": false
                    }
                ]
            },
            "quotes": {
                "10": {
                    "text": "Das ist ein zweiter Test",
                    "createdOn": "2020-05-02T15:20:12.282+02:00"
                }
            },
            "stats": {
                "today": {
                    "10": 0
                },
                "full": {
                    "10": 3
                }
            }
        }
    }
);