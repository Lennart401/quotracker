import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

/**
 * Standard confirmation dialog (e.g. for when deleting something)
 * @param props
 * @returns {*}
 */
const ConfirmDialog = (props) => {
    return (
        <Dialog open={props.open}
                onClose={props.negativeAction}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.negativeAction} color="primary">{props.negativeText}</Button>
                <Button onClick={props.positiveAction} color="primary">{props.positiveText}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;