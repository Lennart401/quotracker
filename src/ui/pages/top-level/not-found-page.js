import React from 'react';
import Typography from "@material-ui/core/Typography";
import { LinkedButton } from "../../components/shared/links";
import { useTitle } from "hookrouter";
import PageWrapper from "../../components/shared/page-wrapper";
import PageTitle from "../../components/shared/page-title";

const NotFoundPage = () => {
    useTitle("404 - Nicht gefunden - quotracker");
    return (
        <PageWrapper>
            <PageTitle title="404 - Seite nicht gefunden"/>
            <Typography variant="body1" style={{marginBottom: 12}}>
                Sorry, die angeforderte Seite wurde leider nicht gefunden :/
            </Typography>
            <LinkedButton variant="contained" color="primary" href="/">
                Zur Startseite
            </LinkedButton> {/* @TODO create a link to go back to the page the user came from */}
        </PageWrapper>
    );
};

export default NotFoundPage;
