import React, { Fragment, useState } from "react";
import { setDialogInfo, showDialog } from "../../../../../logic/state-management/dialogs";
import EditUserPopover, { EDIT_USER_POPOVER_NAME } from "./edit-user-popover";
import ChipList from "./chip-list";

const UsersManager = (props) => {
    const mergedUsers = [props.users.owner, ...props.users.guests];
    const [anchor, setAnchor] = useState(null);

    const handleClick = (event, userId) => {
        setAnchor(event.currentTarget);
        setDialogInfo(EDIT_USER_POPOVER_NAME, {
            user: mergedUsers.find(elem => elem.id === userId)
        });
        showDialog(EDIT_USER_POPOVER_NAME);
    };

    return (
        <Fragment>
            <ChipList targetId={props.targetId} users={props.users} mergedUsers={mergedUsers} handleClick={handleClick}/>
            <EditUserPopover targetId={props.targetId} users={props.users} anchor={anchor}/>
        </Fragment>
    );
};

export default UsersManager;