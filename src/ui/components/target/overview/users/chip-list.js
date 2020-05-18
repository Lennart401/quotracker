import React, { Fragment } from "react";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import AddUserInput from "./add-user-input";
import { usePermissions } from "../../../../../logic/state-management/permissions";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        // justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.0),
        margin: 0,
        alignItems: "flex-end"
    },
    chip: {
        margin: theme.spacing(0.25),
    },
}));

const ChipList = (props) => {
    const classes = useStyles();
    const {canEdit} = usePermissions(props.users);

    return (
        <Box component="ul" className={classes.root}>
            {props.mergedUsers.map((user) => {
                const displayName = user.name;
                const avatar = displayName.substring(0, 1).toUpperCase();

                return (
                    <Fragment key={user.name}>
                        <li>
                            <Chip className={classes.chip} avatar={<Avatar>{avatar}</Avatar>} label={displayName}
                                  onClick={event => props.handleClick(event, user.id)}/>
                        </li>
                    </Fragment>
                );
            })}
            {canEdit && (
                <li key="new" style={{flexGrow: 1}}>
                    <AddUserInput targetId={props.targetId} flexBoxClass={classes.root} chipClass={classes.chip}/>
                </li>
            )}
        </Box>
    );
};

export default ChipList;