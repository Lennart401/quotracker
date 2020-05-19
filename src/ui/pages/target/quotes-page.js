import React, { useLayoutEffect } from "react";
import { useTitle } from "hookrouter";
import PageWrapper from "../../components/shared/page-wrapper";
import PageTitle from "../../components/shared/page-title";
import BackLink from "../../components/shared/back-link";
import QuotesList from "../../components/target/quotes/quotes-list";
import QuotesAddForm from "../../components/target/quotes/quotes-add-form";
import ConfirmDialog from "../../components/shared/confirm-dialog";
import { hideDialog, useDialogState } from "../../../logic/state-management/dialogs";
import { useQuotes, useUsers } from "../../../logic/state-management/api/hooks";
import { createQuote, deleteQuote, updateQuote } from "../../../logic/state-management/api/actions";
import { usePermissions } from "../../../logic/state-management/permissions";
import EditQuoteDialog from "../../components/target/quotes/edit-quote-dialog";

export const QUOTES_CONFIRM_DIALOG_NAME = "quote-delete-confirm";
export const QUOTES_EDIT_DIALOG_NAME = "quote-edit";

const MAX_QUOTE_LENGTH = 100;

const QuotesPage = (props) => {
    useTitle("Sprüche - quotracker");
    const quotes = useQuotes(props.targetId)
    const dialogState = useDialogState(QUOTES_CONFIRM_DIALOG_NAME);
    const users = useUsers(props.targetId);
    const permissions = usePermissions(users);

    useLayoutEffect(() => {
        return () => {
            hideDialog(QUOTES_EDIT_DIALOG_NAME);
            hideDialog(QUOTES_CONFIRM_DIALOG_NAME);
        };
    }, []);

    return (
        <PageWrapper>
            <PageTitle title="Sprüche"/>
            <BackLink href={"overview"}/>
            {quotes && (
                <QuotesList quotes={quotes} canEdit={permissions.canEdit}/>
            )}

            <ConfirmDialog
                open={dialogState ? dialogState.show : false}
                title="Wirklich löschen?"
                text={`Soll der Spruch '${dialogState?.quote}' wirklich gelöscht werden? Einmal gelöscht, kann ein Spruch (derzeit) nicht wiederhergestellt werden!`}
                negativeText="BEHALTEN"
                positiveText="LÖSCHEN"
                negativeAction={() => {
                    hideDialog(QUOTES_CONFIRM_DIALOG_NAME);
                }}
                positiveAction={() => {
                    hideDialog(QUOTES_CONFIRM_DIALOG_NAME);
                    deleteQuote(props.targetId, dialogState?.id);
                }}/>
            <EditQuoteDialog
                name={QUOTES_EDIT_DIALOG_NAME}
                maxQuoteLength={MAX_QUOTE_LENGTH}
                saveAction={(id, quote) => {
                    updateQuote(props.targetId, id, quote);
                }}/>

            {permissions.canEdit && (
                <QuotesAddForm maxQuoteLength={MAX_QUOTE_LENGTH}
                               onCheckedConfirm={(text) => createQuote(props.targetId, text)}/>
            )}
        </PageWrapper>
    );
};

export default QuotesPage;