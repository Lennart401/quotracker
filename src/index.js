import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import * as serviceWorker from './service-worker';
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import { navigate } from "hookrouter";
import { Provider } from "react-redux";
import { store } from "./logic/state-management/store/store";
import { loadingBarReducer } from "react-redux-loading-bar";
import moment from "moment";
import 'moment/locale/de';

const onRedirectCallback = (appState) => {
    navigate(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

store.injectReducer("loadingBar", loadingBarReducer);

moment().locale("de");

ReactDOM.render(
    <Provider store={store}>
        <Auth0Provider
            domain={config.domain}
            client_id={config.clientId}
            redirect_uri={window.location.origin}
            audience={config.audience}
            onRedirectCallback={onRedirectCallback}
        >
            <App/>
        </Auth0Provider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
