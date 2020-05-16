import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { LinkedChip } from "../links";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        // justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.0),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.25),
    },
}));

const UserChipList = (props) => {
    const classes = useStyles();
    const users = [ props.users.owner, ...props.users.guests ];

    return (
        <Typography color="textSecondary" component="div">
            <Box component="ul" className={classes.root}>
                { props.prefixText && (
                    <li style={{alignSelf: "center", marginRight: 8}}>{props.prefixText}</li>
                )}
                {users.map((user) => {
                    const displayName = user.name;
                    const avatar = displayName.substring(0, 1).toUpperCase();
                    const link = `/user/${user.id}`;

                    return (
                        <li key={user.name}>
                            <LinkedChip className={classes.chip} avatar={<Avatar>{avatar}</Avatar>} label={displayName}
                                        href={link}/>
                        </li>
                    );
                })}
            </Box> {/* @TODO add button to invite users to target if required in props, possibly even add option to immediately delete/kick user from target */}
        </Typography>
    );
};

export default UserChipList;