import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItem from "@material-ui/core/ListItem";
import { setDialogInfo, showDialog } from "../../../../logic/state-management/dialogs";
import { QUOTES_CONFIRM_DIALOG_NAME, QUOTES_EDIT_DIALOG_NAME } from "../../../pages/target/quotes-page";

const QuotesListItem = (props) => {
    return (
        <ListItem>
            <ListItemText primary={props.text}/>
            <ListItemSecondaryAction>
                {props.showEdit && (
                    <IconButton onClick={() => {
                        setDialogInfo(QUOTES_EDIT_DIALOG_NAME, {quote: props.text, id: props.id})
                        showDialog(QUOTES_EDIT_DIALOG_NAME);
                    }}>
                        <EditIcon/>
                    </IconButton>
                )}
                {props.showDelete && (
                    <IconButton onClick={() => {
                        setDialogInfo(QUOTES_CONFIRM_DIALOG_NAME, {quote: props.text, id: props.id})
                        showDialog(QUOTES_CONFIRM_DIALOG_NAME);
                    }}>
                        <DeleteIcon/>
                    </IconButton>
                )}
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default QuotesListItem;