import { hideDialog, useDialogState } from "../../../logic/state-management/dialogs";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";

/**
 * An edit-dialog using a "form" from a hook. Has buttons for "SAVE" and "CANCEL"
 *
 * @param {{
 *      name: {string},
 *      title: {string},
 *      saveAction: function(),
 *      form: {
 *          element: *,
 *          checkSave: (function():boolean)
 *      }
 *  }} props
 * @returns {*}
 */
const EditDialog = (props) => {
    const theme = useTheme();
    const dialogState = useDialogState(props.name)
    const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

    const hide = () => {
        hideDialog(props.name);
    }

    const save = () => {
        if (props.form.checkSave()) {
            hide();
            props.saveAction();
        }
    }

    return (
        <Dialog open={dialogState ? dialogState.show : false}
                onClose={hide}
                fullScreen={fullScreen}
                fullWidth>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                {props.form.element}
            </DialogContent>
            <DialogActions>
                <Button onClick={hide} color="primary">ABBRECHEN</Button>
                <Button onClick={save} color="primary">SPEICHERN</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;