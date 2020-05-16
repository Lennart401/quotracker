import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {LinkedButton} from "../../components/top-level/links";
import {useTitle} from "hookrouter";

const LogoutPage = () => {
  useTitle("Logout - SLv2");
  return (
    <Container maxWidth="md">
      <Box className="page-title">
        <Typography variant="h3" component="h2">Ausgeloggt</Typography>
      </Box>
      <Typography variant="body1" style={{marginBottom: 12}}>
        Du hast dich erfolgreich ausgeloggt!
      </Typography>
      <LinkedButton variant="contained" color="primary" href="/">Zur Startseite</LinkedButton>
    </Container>
  );
};

export default LogoutPage;