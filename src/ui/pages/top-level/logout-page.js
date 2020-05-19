import React from "react";
import Typography from "@material-ui/core/Typography";
import { LinkedButton } from "../../components/shared/links";
import { useTitle } from "hookrouter";
import PageWrapper from "../../components/shared/page-wrapper";
import PageTitle from "../../components/shared/page-title";

const LogoutPage = () => {
    useTitle("Logout - quotracker");
    return (
        <PageWrapper>
            <PageTitle title="Ausgeloggt"/>
            <Typography variant="body1" style={{marginBottom: 12}}>
                Du hast dich erfolgreich ausgeloggt!
            </Typography>
            <LinkedButton variant="contained" color="primary" href="/">Zur Startseite</LinkedButton>
        </PageWrapper>
    );
};

export default LogoutPage;