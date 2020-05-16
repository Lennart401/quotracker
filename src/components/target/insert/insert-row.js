import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createRecord, deleteLatestRecord } from "../../../redux/apiv2/actions";

const InsertRow = (props) => {
    const targetId = props.targetId;
    const quoteId = props.quoteId;
    const quoteText = props.quote.text;
    const quoteCount = props.quote.count;

    return (
        <Grid container item xs={12} spacing={3} direction="row" justify="flex-start" alignItems="center">
            <Grid item xs={9} sm={7} md={5}>
                <Button size="large" variant="outlined" color="primary"
                        onClick={() => createRecord(targetId, quoteId)}>
                    {quoteText}
                </Button>
            </Grid>
            <Grid item xs={1}>
                <Typography variant="body1" component="div">
                    {quoteCount}
                </Typography>
            </Grid>
            <Grid item xs={2} md={1}>
                <Button variant="text" onClick={() => deleteLatestRecord(targetId, quoteId)}>
                    ( -1 )
                </Button>
            </Grid>
        </Grid>
    );
};

export default InsertRow;