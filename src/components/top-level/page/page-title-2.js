import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const PageTitle2 = (props) => {
    return (
        <Box className="page-title-2">
            <Typography variant="h4">{props.title}{props.children}</Typography>
        </Box>
    );
}

export default PageTitle2;