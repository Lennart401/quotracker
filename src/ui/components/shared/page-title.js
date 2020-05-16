import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const PageTitle = (props) => {
    return (
        <Box className="page-title">
            <Typography variant="h3" component="h1">{props.title}{props.children}</Typography>
        </Box>
    );
}

export default PageTitle;