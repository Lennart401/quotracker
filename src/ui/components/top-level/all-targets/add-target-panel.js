import React from "react";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import { ExpansionPanel } from "@material-ui/core";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { useEditTargetForm } from "../../shared/target/edit-target-form";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { createTarget } from "../../../../logic/state-management/api/actions";

const useStyles = makeStyles({
    textField: {
        width: "100%"
    },
    button: {
        float: "right",
        marginTop: 16
    },
    spaceAtTop: {
        marginTop: 8
    },
    fullWidth: {
        width: "100%"
    }
});

const AddTargetPanel = (props) => {
    const form = useEditTargetForm(null, props.maxTitleLength, props.maxDescriptionLength);
    const classes = useStyles();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (form.checkSave()) {
            createTarget({
                title: form.title,
                description: form.description
            })
        }
        form.clearData();
    }

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant="body1">Neues Target erstellen</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <form noValidate autoComplete="off" onSubmit={handleSubmit} className={classes.fullWidth}>
                    {form.element}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}>
                        Erstellen
                    </Button>
                </form>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

export default AddTargetPanel;