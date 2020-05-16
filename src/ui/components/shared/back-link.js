import React from "react";
import { LinkedLink } from "./links";
import Typography from "@material-ui/core/Typography";

const BackLink = (props) => {
    return (
        <Typography className="cs-row">
            <LinkedLink href={props.href}>{props.text ? props.text : "zurück zur Übersicht"}</LinkedLink>
        </Typography>
    );
}

export default BackLink;