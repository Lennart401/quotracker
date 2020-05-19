import React from "react";
import { useAuth0 } from "../../../react-auth0-spa";
import Button from "@material-ui/core/Button";
import { LinkedButton } from "../../components/shared/links";
import { useTitle } from "hookrouter";
import PageTitle from "../../components/shared/page-title";
import PageWrapper from "../../components/shared/page-wrapper";
import Caption from "../../components/shared/caption";

const HomePage = () => {
    useTitle("Home - quotracker");
    const {isAuthenticated, loginWithRedirect} = useAuth0();

    // console.log("re-render!");

    return (
        <PageWrapper>
            <PageTitle title="quotracker"/>
            <Caption text="<< Track die Sprüche deiner Profs/Lehrer >>"/>
            <br/>

            {/* @TODO write welcome text for the homepage (landing-page alike, maybe with [interactive] examples) */}
            {!isAuthenticated && (
                <Button variant="contained" color="primary"
                        onClick={() => loginWithRedirect()}>Anmelden/Registrieren</Button>
            )}
            {isAuthenticated && (
                <LinkedButton variant="contained" color="primary" href={"/alltargets"}>Zu allen Targets</LinkedButton>
            )}
            {/*<Button variant="contained" onClick={() => dispatch(showLoading())}>start loading</Button>*/}
            {/*<Button variant="contained" onClick={() => dispatch(hideLoading())}>stop loading</Button>*/}
            {/*<Button variant="contained" onClick={() => setErrorMessage("This is a test")}>Set global error</Button>*/}
            {/*<Button variant="contained" onClick={() => clearErrorMessage()}>Remove global error</Button>*/}
        </PageWrapper>
    );
};

export default HomePage;