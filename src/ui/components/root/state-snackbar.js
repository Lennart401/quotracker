import React, { useLayoutEffect, useState } from "react";
import { clearErrorMessage, useErrorMessage } from "../../../logic/state-management/error-message";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Alert } from "./alert";

/**
 * Use can either use useAlert = true with severity OR action with actionName
 */
const StateSnackbar = ({errorState, useAlert = true, severity = "error", actionName = "Rückgängig machen", action = null}) => {
    const errorMessage = useErrorMessage(errorState);

    const error = errorMessage;
    const open = !!errorMessage;
    const [latestError, setLatestError] = useState("");

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (open) {
            clearErrorMessage(errorState);
        }
    };

    let alert = null;
    if (useAlert) {
        alert = (
            <Alert severity={severity} onClose={handleClose}>
                {latestError}
            </Alert>
        );
    }

    useLayoutEffect(() => {
        if (error) {
            setLatestError(error);
        }
    }, [error]);

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={open}
            autoHideDuration={6000}
            // action={action && <Button onClick={action} size="small" color="secondary">{actionName}</Button>}
            message={action && latestError}
            onClose={handleClose}
            action={action && (
                <React.Fragment>
                    <Button color="secondary" size="small" onClick={action}>
                        UNDO
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </React.Fragment>
            )}>
            {alert}
        </Snackbar>
    );
};

export default StateSnackbar;