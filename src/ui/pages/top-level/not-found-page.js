import React from 'react';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { LinkedButton } from "../../components/shared/links";
import { useTitle } from "hookrouter";

const NotFoundPage = () => {
    useTitle("404 - Nicht gefunden - SLv2");
    return (
        <Container maxWidth="md">
            <Box className="page-title">
                <Typography variant="h3" component="h1">404 - Seite nicht gefunden</Typography>
            </Box>
            <Typography variant="body1" style={{marginBottom: 12}}>
                Sorry, die angeforderte Seite wurde leider nicht gefunden :/
            </Typography>
            <LinkedButton variant="contained" color="primary" href="/">Zur
                Startseite</LinkedButton> {/* @TODO create a link to go back to the page the user came from */}
        </Container>
    );
};

export default NotFoundPage;
