import React, { useLayoutEffect, useState } from "react";
import { TextField } from "@material-ui/core";

/**
 * @param dialogState {null|{quote: {string}}}
 * @param maxQuoteLength {number}
 * @param label {string}
 * @returns {{checkSave: (function(): boolean), quote: string, element: *}}
 */
export const useEditQuotesForm = (dialogState, maxQuoteLength, label) => {
    const [enteredText, setEnteredText] = useState("");
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState("");

    const handleChange = (event) => {
        setEnteredText(event.target.value);
        setError(event.target.value.length > maxQuoteLength);

        if (event.target.value.length > maxQuoteLength) setHelperText(`Spruch darf nicht länger als ${maxQuoteLength} Zeichen sein`);
        else setHelperText("");
    }

    const onSave = () => {
        if (enteredText.length === 0) {
            setError(true);
            setHelperText("Spruch darf nicht leer sein");
        }
        if (enteredText.length > 0 && enteredText.length <= maxQuoteLength) {
            setEnteredText("");
            return true;
        } else {
            return false;
        }
    };
    
    useLayoutEffect(() => {
        if (dialogState) {
            setEnteredText(dialogState.quote);
        }
    }, [dialogState]);

    return {
        checkSave: onSave,
        quote: enteredText,
        element: (
            <TextField label={label}
                       variant="outlined"
                       fullWidth
                       size="small"
                       error={error}
                       helperText={helperText}
                       value={enteredText}
                       onChange={handleChange}/>
        )
    };
}