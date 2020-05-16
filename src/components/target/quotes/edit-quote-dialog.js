import React from "react";
import { useDialogState } from "../../../redux/dialogs";
import { useEditQuotesForm } from "./edit-quote-form";
import EditDialog from "../../top-level/edit-dialog";

const EditQuoteDialog = (props) => {
    const dialogState = useDialogState(props.name);
    const form = useEditQuotesForm(dialogState, props.maxQuoteLength);

    return (
        <EditDialog
            name={props.name}
            title={"Spruche bearbeiten"}
            saveAction={() => props.saveAction(dialogState.id, form.quote)}
            form={form}/>
    );
};

export default EditQuoteDialog;