import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import PageTitle from "../../top-level/page/page-title";
import IconButton from "@material-ui/core/IconButton";
import { setDialogInfo, showDialog } from "../../../redux/dialogs";
import { TARGET_EDIT_DIALOG_NAME } from "../../../pages/top-level/all-targets-page";

const OverviewPageTitle = (props) => {
    return (
        <PageTitle title={props.title}>
            {props.showEditIcon && (
                <IconButton onClick={() => {
                    setDialogInfo(TARGET_EDIT_DIALOG_NAME, {
                        title: props.title,
                        description: props.description,
                        id: props.id
                    });
                    showDialog(TARGET_EDIT_DIALOG_NAME);
                }} style={{marginLeft: 16}}><EditIcon/></IconButton>
            )}
        </PageTitle>
    );
}

export default OverviewPageTitle;