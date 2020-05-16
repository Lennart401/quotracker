import React from "react";
import { Box } from "@material-ui/core";
import { LinkedButton } from "../../shared/links";

const HorizontalButtonGroup = (props) => {
    return (
        <Box className="cs-button-group">
            {props.buttons.map(button => (
                <LinkedButton key={button.href} variant="outlined" disabled={button.disabled} color="secondary" href={button.href}>
                    {button.text}
                </LinkedButton>
            ))}
        </Box>
    );
}

export default HorizontalButtonGroup;