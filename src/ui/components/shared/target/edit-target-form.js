import React, { useLayoutEffect, useState } from "react";
import { TextField } from "@material-ui/core";

/**
 * @param dialogState {null|{}}
 * @param maxTitleLength {number}
 * @param maxDescriptionLength {number}
 * @returns {{checkSave: (function(): boolean), clearData: (function()), description: string, title: string, element: *}}
 */
export const useEditTargetForm = (dialogState, maxTitleLength, maxDescriptionLength) => {
    const [enteredTitle, setEnteredTitle] = useState("");
    const [enteredDescription, setEnteredDescription] = useState("");

    const [errorTitle, setErrorTitle] = useState(false);
    const [errorDescription, setErrorDescription] = useState(false);

    // @TODO simplify helper: use an expression, i.e. helperText={errorTitle ? "...Text..." : ""}
    const [helperTextTitle, setHelperTextTitle] = useState("");
    const [helperTextDescription, setHelperTextDescription] = useState("");

    const handleTitleChange = (event) => {
        setEnteredTitle(event.target.value);
        setErrorTitle(event.target.value.length > maxTitleLength);

        if (event.target.value.length > maxTitleLength) setHelperTextTitle(`Titel darf nicht länger als ${maxTitleLength} Zeichen sein`);
        else setHelperTextTitle("");
    };

    const handleDescriptionChange = (event) => {
        setEnteredDescription(event.target.value);
        setErrorDescription(event.target.value.length > maxDescriptionLength);

        if (event.target.value.length > maxDescriptionLength) setHelperTextDescription(`Beschreibung darf nicht länger als ${maxDescriptionLength} Zeichen sein`)
        else setHelperTextDescription("");
    };

    const onSave = () => {
        if (enteredTitle.length === 0) {
            setErrorTitle(true);
            setHelperTextTitle("Titel darf nicht leer sein")
        }
        if (enteredDescription.length === 0) {
            setErrorDescription(true);
            setHelperTextDescription("Beschreibung darf nicht leer sein")
        }

        return (enteredTitle.length > 0 && enteredTitle.length <= maxTitleLength
            && enteredDescription.length > 0 && enteredDescription.length <= maxDescriptionLength);
    };

    const clearData = () => {
        setEnteredTitle("");
        setEnteredDescription("");
        setHelperTextTitle("");
        setHelperTextDescription("");
        setErrorTitle(false);
        setErrorDescription(false);
    }

    useLayoutEffect(() => {
        if (dialogState) {
            setEnteredTitle(dialogState.title);
            setEnteredDescription(dialogState.description);
        }
    }, [dialogState]);

    return {
        checkSave: onSave,
        clearData: clearData,
        title: enteredTitle,
        description: enteredDescription,
        element: (
            <div>
                <TextField autoFocus
                           fullWidth
                           error={errorTitle}
                           helperText={helperTextTitle}
                           value={enteredTitle}
                           onChange={handleTitleChange}
                           label="Titel des Targets"/>
                <TextField fullWidth
                           multiline
                           style={{marginTop: 16}}
                           error={errorDescription}
                           helperText={helperTextDescription}
                           value={enteredDescription}
                           onChange={handleDescriptionChange}
                           label="Beschreibung des Targets"/>
            </div>
        )
    };
};