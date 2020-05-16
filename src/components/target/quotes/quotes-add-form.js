import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useEditQuotesForm } from "./edit-quote-form";

const useStyles = makeStyles({
    textField: {
        width: "100%"
    },
    button: {
        float: "right"
    },
    spaceAtTop: {
        marginTop: 8
    }
});

const QuotesAddForm = (props) => {
    const classes = useStyles();
    const form = useEditQuotesForm(null, props.maxQuoteLength, "Neuen Spruch hinzufügen");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (form.checkSave()) {
            props.onCheckedConfirm(form.quote);
        }
    };

    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit} className={classes.spaceAtTop}>
            <Grid container spacing={2} direction="row" alignItems="flex-start" justify="space-between">
                <Grid item xs key="text-field">
                    {form.element}
                </Grid>
                <Grid item xs={12} sm={3} md={2} key="button">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}>
                        Hinzufügen
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

// const QuotesAddForm = (props) => {
//     const [enteredText, setEnteredText] = useState("");
//     const [error, setError] = useState(false);
//     const [helperText, setHelperText] = useState("");
//     const classes = useStyles();
//
//     const handleChange = (event) => {
//         setEnteredText(event.target.value);
//         setError(event.target.value.length > props.maxQuoteLength);
//
//         // if (event.target.value.length === 0) setHelperText("Spruch darf nicht leer sein");
//         if (event.target.value.length > props.maxQuoteLength) setHelperText(`Spruch darf nicht länger als ${props.maxQuoteLength} Zeichen sein`);
//         else setHelperText("");
//     }
//
//     const handleSubmit = (event) => {
//         event.preventDefault();
//         if (enteredText.length === 0) {
//             setError(true);
//             setHelperText("Spruch darf nicht leer sein");
//         }
//         if (enteredText.length > 0 && enteredText.length <= props.maxQuoteLength) {
//             props.onCheckedConfirm(enteredText);
//             setEnteredText("");
//         }
//     };
//
//     return (
//         <form noValidate autoComplete="off" onSubmit={handleSubmit} className={classes.spaceAtTop}>
//             <Grid container spacing={2} direction="row" alignItems="flex-start" justify="space-between">
//                 <Grid item xs key="text-field">
//                     <TextField id="entered-text"
//                                label="Neuen Spruch eingeben"
//                                variant="outlined"
//                                className={classes.textField}
//                                size="small"
//                                error={error}
//                                helperText={helperText}
//                                value={enteredText}
//                                onChange={handleChange}/>
//                 </Grid>
//                 <Grid item xs={12} sm={3} md={2} key="button">
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         className={classes.button}>
//                         Hinzufügen
//                     </Button>
//                 </Grid>
//             </Grid>
//         </form>
//     );
// };

export default QuotesAddForm;