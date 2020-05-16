import React, { useLayoutEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { clearErrorMessage, useErrorMessage } from "../../redux/error-message";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ErrorSnackbar = (props) => {
    const errorMessage = useErrorMessage();

    const error = errorMessage;
    const open = !!errorMessage;
    const [latestError, setLatestError] = useState("");
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (open) {
            clearErrorMessage();
        }
    };
    
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
            onClose={handleClose}>
            <Alert severity="error" onClose={handleClose}>
                {latestError}
            </Alert>
        </Snackbar>
    );
};

export default ErrorSnackbar;