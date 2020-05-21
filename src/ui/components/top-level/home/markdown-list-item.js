import React from "react";
import Typography from "@material-ui/core/Typography";

const MarkdownListItem = ({term, children}) => {
    return (
        <li>
            <Typography variant="body1"><Typography variant="button">{term}</Typography> &ndash; {children}</Typography>
        </li>
    );
};

export default MarkdownListItem;