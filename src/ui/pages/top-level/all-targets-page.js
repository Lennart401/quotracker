import React from 'react';
import { useTitle } from "hookrouter";
import TargetCard from "../../components/top-level/all-targets/target-card";
import PageTitle from "../../components/shared/page-title";
import PageWrapper from "../../components/shared/page-wrapper";
import { useTargets } from "../../../logic/state-management/api/hooks";
import { hideDialog, useDialogState } from "../../../logic/state-management/dialogs";
import ConfirmDialog from "../../components/shared/confirm-dialog";
import { deleteTarget, updateTarget } from "../../../logic/state-management/api/actions";
import EditTargetDialog from "../../components/shared/target/edit-target-dialog";
import AddTargetPanel from "../../components/top-level/all-targets/add-target-panel";

const allTargetsPageTitle = "Alle Targets";
export const TARGET_DELETE_DIALOG_NAME = "target-delete-confirm";
export const TARGET_EDIT_DIALOG_NAME = "target-edit";

export const MAX_TITLE_LENGTH = 70;
export const MAX_DESCRIPTION_LENGTH = 280;

const AllTargetsPage = () => {
    useTitle(`${allTargetsPageTitle} - SLv2`);
    const targets = useTargets();
    const deleteDialogState = useDialogState(TARGET_DELETE_DIALOG_NAME);

    return (
        <PageWrapper>
            {targets && (
                <div>
                    <PageTitle title={allTargetsPageTitle}/>
                    {Object.entries(targets).map(([id, target]) => {
                        if (target.users) {
                            return <TargetCard id={id} targetInfo={target.info} targetUsers={target.users} key={id}/>;
                        }
                        return null;
                    })}
                    <AddTargetPanel maxTitleLength={MAX_TITLE_LENGTH}
                                    maxDescriptionLength={MAX_DESCRIPTION_LENGTH}/>

                    {/* this is to add some padding to the bottom of the page */}
                    <p/>

                    <EditTargetDialog name={TARGET_EDIT_DIALOG_NAME}
                                      maxTitleLength={MAX_TITLE_LENGTH}
                                      maxDescriptionLength={MAX_DESCRIPTION_LENGTH}
                                      saveAction={(targetId, title, description) => {
                                          updateTarget(targetId, {title: title, description: description});
                                      }}/>
                    <ConfirmDialog open={deleteDialogState ? deleteDialogState.show : false}
                                   title="Wirklich löschen?"
                                   text={`Soll das Target '${deleteDialogState?.title}' wirklich gelöscht werden? Einmal gelöscht, kann das Target (derzeit) nicht wiederhergestellt werden.`}
                                   negativeText="BEHALTEN"
                                   positiveText="LÖSCHEN"
                                   negativeAction={() => {
                                       hideDialog(TARGET_DELETE_DIALOG_NAME);
                                   }}
                                   positiveAction={() => {
                                       hideDialog(TARGET_DELETE_DIALOG_NAME);
                                       deleteTarget(deleteDialogState?.id)
                                   }}/>
                </div>
            )}
        </PageWrapper>
    );
};

export default AllTargetsPage;
