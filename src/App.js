import React, { useEffect } from 'react';
import NotFoundPage from "./ui/pages/top-level/not-found-page";
import AppHeader from "./ui/components/root/app-header";
import AllTargetsPage from "./ui/pages/top-level/all-targets-page";
import TargetNestedRouter from "./ui/pages/top-level/target-nested-router";
import "./App.css";
import { usePath, useRoutes } from "hookrouter";
import HomePage from "./ui/pages/top-level/home-page";
import { useAuth0 } from "./react-auth0-spa";
import LogoutPage from "./ui/pages/top-level/logout-page";
import { createMuiTheme } from "@material-ui/core";
import orange from "@material-ui/core/colors/orange";
import { ThemeProvider } from "@material-ui/styles";
import blue from "@material-ui/core/colors/blue";
import MainLoader from "./ui/components/root/main-loader";
import StateSnackbar from "./ui/components/root/state-snackbar";
import Typography from "@material-ui/core/Typography";

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: orange,
    },
});

const routes = {
    "/": () => <HomePage/>,
    "/alltargets": () => <AllTargetsPage/>,
    "/target*": () => <TargetNestedRouter/>,
    "/logout": () => <LogoutPage/>,
};

const basePath = process.env.PUBLIC_URL;
const publicPaths = [
    "",
    "/",
    "/logout",
    "/404",
    `${basePath}`,
    `${basePath}/logout`,
    `${basePath}/404`
];

const App = () => {
    const path = usePath();
    const {loading, isAuthenticated, loginWithRedirect} = useAuth0();
    //const error = useErrorMessage();

    // only takes effect after the page is rendered an the content has been attempted to be loaded
    useEffect(() => {
        // if the content is loading, the user is already authenticated or you are on one of the public pages --> do nothing
        if (loading || isAuthenticated || publicPaths.includes(path)) {
            return;
        }

        // start the login procedure, but as the state it sets the current path. the user will be redirected to
        // this path once the login is successful
        const awaitLogin = async () => {
            await loginWithRedirect({
                appState: {
                    targetUrl: window.location.pathname
                }
            });
        };
        awaitLogin();
    }, [loading, isAuthenticated, loginWithRedirect, path]);

    const routeResult = useRoutes(routes);

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <MainLoader/>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <AppHeader/>
            {/*<ErrorSnackbar open={!!error} error={error}/>*/}
            <StateSnackbar errorState="global"/>
            {routeResult || <NotFoundPage/>}
            <Typography variant="body2" style={{
                position: "fixed",
                left: 0,
                bottom: 0,
                color: "#ccc"
            }}>Version 0.6.9</Typography>
        </ThemeProvider>
    );
};

export default App;
