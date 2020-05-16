import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const ErrorCard = (props) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h4">
                    Es ist ein Fehler aufgetreten!
                </Typography>
                <Typography variant="body2">
                    Fehlerbeschreibung: {props.error}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default ErrorCard;