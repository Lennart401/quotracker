import React, { Fragment, useLayoutEffect, useState } from "react";
import { hideDialog, setDialogInfo, showDialog, useDialogState } from "../../../../../logic/state-management/dialogs";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { Checkbox, Popover } from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { usePermissions } from "../../../../../logic/state-management/permissions";
import { removeUser, updateUser } from "../../../../../logic/state-management/api/actions";
import ConfirmDialog from "../../../shared/confirm-dialog";

export const EDIT_USER_POPOVER_NAME = "user-edit-popover";
const REMOVE_USER_DIALOG_NAME = "user-remove-confirm";

// @TODO rewrite and clean up this component
const EditUserPopover = ({targetId, users, anchor}) => {
    const dialogState = useDialogState(EDIT_USER_POPOVER_NAME);
    const show = dialogState?.show ? dialogState.show : false;

    const removeDialogState = useDialogState(REMOVE_USER_DIALOG_NAME);

    const {canEdit: canCurrentUserEdit} = usePermissions(users);

    const [isOwner, setIsOwner] = useState(false);
    const [canSubmitRecords, setCanSubmitRecords] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    useLayoutEffect(() => {
        if (dialogState != null && dialogState.user) {
            if (dialogState?.user?.canSubmitRecords == null && dialogState?.user?.canEdit == null) {
                setIsOwner(true);
                setCanSubmitRecords(true);
                setCanEdit(true);
            } else {
                setIsOwner(false);
                setCanSubmitRecords(dialogState.user.canSubmitRecords);
                setCanEdit(dialogState.user.canEdit);
            }
        }
    }, [dialogState, isOwner]);

    useLayoutEffect(() => {
        return () => {
            hideDialog(REMOVE_USER_DIALOG_NAME);
            close();
        };
    }, []);

    const handleClose = () => {
        const hasChanged = canSubmitRecords !== dialogState.user.canSubmitRecords || canEdit !== dialogState.user.canEdit;
        if (!isOwner && hasChanged) {
            updateUser(targetId, {
                id: dialogState.user.id,
                canSubmitRecords: canSubmitRecords,
                canEdit: canEdit
            });
        }

        close();
    };

    const handleRemoveUser = () => {
        setDialogInfo(REMOVE_USER_DIALOG_NAME, {
            user: dialogState.user,
            targetId: targetId
        });
        showDialog(REMOVE_USER_DIALOG_NAME);
    };

    const close = () => {
        setDialogInfo(EDIT_USER_POPOVER_NAME, null);
        hideDialog(EDIT_USER_POPOVER_NAME);
    };

    return (
        <Fragment>
            <Popover
                open={show}
                anchorEl={show ? anchor : null}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}>
                <Card>
                    <List>
                        <ListItem key="canSubmitRecords">
                            <ListItemText primary="Darf Records eintragen?"/>
                            <ListItemSecondaryAction>
                                <Checkbox
                                    edge="end"
                                    checked={canSubmitRecords}
                                    onChange={event => {
                                        setCanSubmitRecords(event.target.checked);
                                        if (!event.target.checked) {
                                            setCanEdit(false);
                                        }
                                    }}
                                    disabled={isOwner || !canCurrentUserEdit}
                                    color="primary"/>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem key="canEdit">
                            <ListItemText primary="Darf bearbeiten?"/>
                            <ListItemSecondaryAction>
                                <Checkbox
                                    edge="end"
                                    checked={canEdit}
                                    onChange={event => {
                                        setCanEdit(event.target.checked);
                                        if (event.target.checked) {
                                            setCanSubmitRecords(true);
                                        }
                                    }}
                                    disabled={isOwner || !canCurrentUserEdit}
                                    color="primary"/>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                    <CardActions>
                        <Button
                            color="secondary"
                            disabled={isOwner || !canCurrentUserEdit}
                            onClick={handleRemoveUser}>
                            PERSON ENTFERNEN
                        </Button>
                    </CardActions>
                </Card>
            </Popover>

            <ConfirmDialog open={removeDialogState ? removeDialogState.show : false}
                           title="Wirklich entfernen?"
                           text={`Soll '${removeDialogState?.user.name}' wirklich vom Target entfernt werden?`}
                           negativeText="BEHALTEN"
                           positiveText="LÖSCHEN"
                           negativeAction={() => {
                               hideDialog(REMOVE_USER_DIALOG_NAME);
                           }}
                           positiveAction={() => {
                               hideDialog(REMOVE_USER_DIALOG_NAME);
                               removeUser(removeDialogState?.targetId, removeDialogState?.user.id);
                               close();
                           }}/>
        </Fragment>
    );
};

export default EditUserPopover;