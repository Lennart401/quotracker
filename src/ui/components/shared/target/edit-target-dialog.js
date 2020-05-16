import React from "react";
import { useDialogState } from "../../../../logic/state-management/dialogs";
import { useEditTargetForm } from "./edit-target-form";
import EditDialog from "../edit-dialog";

const EditTargetDialog = (props) => {
    const dialogState = useDialogState(props.name)
    const form = useEditTargetForm(dialogState, props.maxTitleLength, props.maxDescriptionLength);

    return (
        <EditDialog
            name={props.name}
            title={"Target bearbeiten"}
            saveAction={() => props.saveAction(dialogState.id, form.title, form.description)}
            form={form}/>
    );
};

export default EditTargetDialog;

// const EditTargetDialog = (props) => {
//     const dialogState = useDialogState(props.name)
//     const theme = useTheme();
//     const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
//     const form = useEditTargetForm(dialogState, props.maxTitleLength, props.maxDescriptionLength);
//
//     const hide = () => {
//         hideDialog(props.name);
//     }
//
//     const save = () => {
//         if (form.checkSave()) {
//             hide();
//             props.saveAction(dialogState.id, form.title, form.description);
//         }
//     }
//
//     return (
//         <Dialog open={dialogState ? dialogState.show : false}
//                 onClose={hide}
//                 fullScreen={fullScreen}
//                 fullWidth>
//             <DialogTitle>Target bearbeiten</DialogTitle>
//             <DialogContent>
//                 {form.element}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={hide} color="primary">ABBRECHEN</Button>
//                 <Button onClick={save} color="primary">SPEICHERN</Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// const EditTargetDialog = (props) => {
//     const dialogState = useDialogState(props.name)
//     const theme = useTheme();
//     const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
//
//     const [enteredTitle, setEnteredTitle] = useState("");
//     const [enteredDescription, setEnteredDescription] = useState("");
//
//     const [errorTitle, setErrorTitle] = useState(false);
//     const [errorDescription, setErrorDescription] = useState(false);
//
//     const [helperTextTitle, setHelperTextTitle] = useState("");
//     const [helperTextDescription, setHelperTextDescription] = useState("");
//
//     const handleTitleChange = (event) => {
//         setEnteredTitle(event.target.value);
//         setErrorTitle(event.target.value.length > props.maxTitleLength);
//
//         if (event.target.value.length > props.maxTitleLength) setHelperTextTitle(`Titel darf nicht länger als ${props.maxTitleLength} Zeichen sein`);
//         else setHelperTextTitle("");
//     };
//
//     const handleDescriptionChange = (event) => {
//         setEnteredDescription(event.target.value);
//         setErrorDescription(event.target.value.length > props.maxDescriptionLength);
//
//         if (event.target.value.length > props.maxDescriptionLength) setHelperTextDescription(`Beschreibung darf nicht länger als ${props.maxDescriptionLength} Zeichen sein`)
//         else setHelperTextDescription("");
//     };
//
//     const hide = () => {
//         hideDialog(props.name);
//     }
//
//     const onSave = () => {
//         if (enteredTitle.length === 0) {
//             setErrorTitle(true);
//             setHelperTextTitle("Titel darf nicht leer sein")
//         }
//         if (enteredDescription.length === 0) {
//             setErrorDescription(true);
//             setHelperTextDescription("Beschreibung darf nicht leer sein")
//         }
//
//         if (enteredTitle.length > 0 && enteredTitle.length <= props.maxTitleLength
//             && enteredDescription.length > 0 && enteredDescription.length <= props.maxDescriptionLength) {
//
//             hide();
//             props.saveAction(dialogState.id, enteredTitle, enteredDescription);
//         }
//     };
//
//     useLayoutEffect(() => {
//         if (dialogState) {
//             setEnteredTitle(dialogState.title);
//             setEnteredDescription(dialogState.description);
//         }
//     }, [dialogState]);
//
//     return (
//         <Dialog open={dialogState ? dialogState.show : false}
//                 onClose={hide}
//                 fullScreen={fullScreen}
//                 fullWidth>
//             <DialogTitle>Target</DialogTitle>
//             <DialogContent>
//                 <TextField autoFocus
//                            fullWidth
//                            error={errorTitle}
//                            helperText={helperTextTitle}
//                            value={enteredTitle}
//                            onChange={handleTitleChange}
//                            id="title"
//                            label="Titel des Targets"/>
//                 <TextField fullWidth
//                            multiline
//                            style={{marginTop: 16}}
//                            error={errorDescription}
//                            helperText={helperTextDescription}
//                            value={enteredDescription}
//                            onChange={handleDescriptionChange}
//                            id="description"
//                            label="Beschreibung des Targets"/>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={hide} color="primary">ABBRECHEN</Button>
//                 <Button onClick={onSave} color="primary">SPEICHERN</Button>
//             </DialogActions>
//         </Dialog>
//     );
// };
