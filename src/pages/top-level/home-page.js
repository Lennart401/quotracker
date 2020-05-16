import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import Button from "@material-ui/core/Button";
import { LinkedButton } from "../../components/top-level/links";
import { useTitle } from "hookrouter";
import { hideLoading, showLoading } from "react-redux-loading-bar";
import { useDispatch } from "react-redux";
import { clearErrorMessage, setErrorMessage } from "../../redux/error-message";
import PageTitle from "../../components/top-level/page/page-title";
import PageWrapper from "../../components/top-level/page/page-wrapper";

const HomePage = () => {
    useTitle("Home - SLv2");
    const {isAuthenticated, loginWithRedirect} = useAuth0();
    const dispatch = useDispatch();

    console.log("re-render!");

    return (
        <PageWrapper>
            <PageTitle title="Sloddi labert v2"/>
            {/* @TODO write welcome text for the homepage (landing-page alike, maybe with [interactive] examples) */}
            {!isAuthenticated && (
                <Button variant="contained" color="primary"
                        onClick={() => loginWithRedirect()}>Anmelden/Registrieren</Button>
            )}
            {isAuthenticated && (
                <LinkedButton variant="contained" color="primary" href={"/alltargets"}>Zu allen Targets</LinkedButton>
            )}
            <Button variant="contained" onClick={() => dispatch(showLoading())}>start loading</Button>
            <Button variant="contained" onClick={() => dispatch(hideLoading())}>stop loading</Button>
            <Button variant="contained" onClick={() => setErrorMessage("This is a test")}>Set global error</Button>
            <Button variant="contained" onClick={() => clearErrorMessage()}>Remove global error</Button>
        </PageWrapper>
    );
};

export default HomePage;