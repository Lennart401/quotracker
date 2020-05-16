import React from "react";
import InsertRow from "./insert-row";
import Grid from "@material-ui/core/Grid";

const InsertButtonsWrapper = (props) => {
    return (
        <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
            {props.quotes && Object.entries(props.quotes).map(([id, value]) => (
                <InsertRow key={id} targetId={props.targetId} quoteId={id} quote={value}/>
            ))}
        </Grid>
    );
};

export default InsertButtonsWrapper;