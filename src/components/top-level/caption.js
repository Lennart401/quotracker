import React from "react";
import Typography from "@material-ui/core/Typography";

const Caption = (props) => {
    return (
        <Typography variant="body1" className="cs-caption">
            {props.text}{props.children}
        </Typography>
    );
}

export default Caption;