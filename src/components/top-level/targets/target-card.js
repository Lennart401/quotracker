import CardContent from "@material-ui/core/CardContent";
import { navigate } from "hookrouter";
import Typography from "@material-ui/core/Typography";
import { LinkedChip } from "../links";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { setDialogInfo, showDialog } from "../../../redux/dialogs";
import { TARGET_DELETE_DIALOG_NAME, TARGET_EDIT_DIALOG_NAME } from "../../../pages/top-level/all-targets-page";
import CardActionArea from "@material-ui/core/CardActionArea";
import { usePermissions } from "../../../redux/permissions";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
    cardSubheader: {
        marginBottom: "12px!important"
    },
    infoCard: {
        marginBottom: 16
    }
}));

const TargetCard = (props) => {
    const classes = useStyles();
    const id = props.id;
    const info = props.targetInfo;
    const users = props.targetUsers;

    const {isOwner, canEdit} = usePermissions(users);

    return (
        <Card className={classes.infoCard}>
            <CardActionArea onClick={() => navigate(`/target/${id}/overview`)}>
                <CardContent>
                    <Typography variant="h5">
                        {info.title}
                    </Typography>
                    <Typography variant="body1">
                        {info.description}
                    </Typography>
                    <Typography color="textSecondary" component="div">
                        erstellt von&nbsp;
                        <Chip
                            avatar={<Avatar>{users.owner.id.substring(0, 1).toUpperCase()}</Avatar>}
                            label={users.owner.name}
                            // href={`/user/${users.owner.id}`}
                        />
                    </Typography>
                </CardContent>
            </CardActionArea>
            {/*<CardContent style={{paddingTop: 0}}>*/}
            {/*    */}
            {/*</CardContent>*/}

            {canEdit && (
                <CardActions>
                    <Button size="small" color="primary" onClick={() => {
                        setDialogInfo(TARGET_EDIT_DIALOG_NAME, {
                            title: info.title,
                            description: info.description,
                            id: id
                        });
                        showDialog(TARGET_EDIT_DIALOG_NAME);
                    }}>
                        bearbeiten
                    </Button>

                    {isOwner && (
                        <Button size="small" color="primary" onClick={() => {
                            setDialogInfo(TARGET_DELETE_DIALOG_NAME, {title: info.title, id: id});
                            showDialog(TARGET_DELETE_DIALOG_NAME);
                        }}>
                            löschen
                        </Button>
                    )}
                </CardActions>
            )}
        </Card>
    );
};

export default TargetCard;