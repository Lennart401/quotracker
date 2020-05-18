import React, { Fragment, useState } from "react";
import { Box, CircularProgress, TextField } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { tryAddUser } from "../../../../../logic/state-management/api/actions";

const AddUserInput = ({targetId, flexBoxClass, chipClass}) => {
    const [text, setText] = useState("");
    const [chips, setChips] = useState([]);
    const [failed, setFailed] = useState([]);

    const searchForUser = (input) => {
        if (!chips.includes(input)) {
            // @TODO HIER GEHT ES WEITER!!
            setChips(current => [...current, input]);

            // @TODO make a search-call to the api
            tryAddUser(targetId, {
                email: input,
                canSubmitRecords: false,
                canEdit: false
            }, status => {
                if (status === "OK") {
                    setChips(current => current.filter(elem => elem !== input));
                } else {
                    if (!failed.includes(input)) {
                        setFailed(current => [...current, input]);
                    }
                }
            });
        }
        // addUser(targetId, {
        //     userId: `id(${input})`,
        //     email: input,
        //     canSubmitRecords: false,
        //     canEdit: false
        // });
        setText("");
    };

    const onChange = (event) => {
        let input = event.target.value;
        setText(input);

        if (input.trim().length > 2 && input.endsWith(" ")) {
            searchForUser(input.trim());
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        searchForUser(text.trim());
    };

    return (
        <Fragment>
            <Box component="ul" className={flexBoxClass}>
                {chips.map(name => (
                    <Chip
                        key={name}
                        className={chipClass}
                        label={name}
                        color={!failed.includes(name) ? "default" : "secondary"}
                        avatar={!failed.includes(name) ? <CircularProgress size={18} color="inherit" thickness={6} /> : null}
                        onDelete={!failed.includes(name) ? null : () => {
                            setChips(current => current.filter(elem => elem !== name));
                        }}
                        onClick={() => {
                            setText(name);
                            setChips(current => current.filter(elem => elem !== name));
                        }}
                    />
                ))}
                <form noValidate autoComplete="off" onSubmit={handleSubmit} style={{flexGrow: 1, marginLeft: 4}}>
                    <TextField
                        fullWidth
                        value={text}
                        onChange={onChange}
                        label="Personen hinzufügen (E-Mail)"
                    />
                </form>
            </Box>
        </Fragment>
    );
};

export default AddUserInput;