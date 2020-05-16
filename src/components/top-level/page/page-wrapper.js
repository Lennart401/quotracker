import React from "react";
import { Container } from "@material-ui/core";

const PageWrapper = (props) => {
    return (
        <Container maxWidth="md">
            {props.children ? props.children : <div/>}
        </Container>
    );
};

export default PageWrapper;