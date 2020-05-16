import React from "react";
import Typography from "@material-ui/core/Typography";

const StatsListing = (props) => {
    return (
        <Typography variant="body1" style={{marginBottom: 16}} component="div">
            {Object.entries(props.quotes).map(([key, value], index) => {
                return (
                    <span key={index}>
                        {key}: {value}<br/>
                    </span>
                );
            })}
        </Typography>
    );
};

export default StatsListing;