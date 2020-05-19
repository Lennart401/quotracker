import React, { useLayoutEffect } from "react";
import { useTitle } from "hookrouter";
import PageWrapper from "../../components/shared/page-wrapper";
import OverviewHeader from "../../components/target/overview/overview-header";
import OverviewSummary from "../../components/target/overview/overview-summary";
import OverviewStats from "../../components/target/overview/overview-stats";
import { useOverview } from "../../../logic/state-management/api/hooks";
import { updateTarget } from "../../../logic/state-management/api/actions";
import EditTargetDialog from "../../components/shared/target/edit-target-dialog";
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_TITLE_LENGTH,
    TARGET_EDIT_DIALOG_NAME
} from "../top-level/all-targets-page";
import { usePermissions } from "../../../logic/state-management/permissions";
import { hideDialog } from "../../../logic/state-management/dialogs";

const summarizeQuotes = (quotes, stats) => {
    let total = 0;
    if (stats?.full && Object.entries(stats.full).length > 0) {
        total = Object.values(stats.full).reduce((total, amount) => total + amount)
    }

    return {
        amountQuotes: quotes ? Object.entries(quotes).length : 0,
        totalRecords: total
    };
};

const buildSimpleStats = (quotes, stats) => {
    let simpleStats = {};
    if (quotes && stats) {
        for (let [key, value] of Object.entries(quotes)) {
            simpleStats[value.text] = stats[key];
        }
    }
    return simpleStats;
}

const OverviewPage = (props) => {
    useTitle("Übersicht - quotracker");
    const target = useOverview(props.targetId);
    const permissions = usePermissions(target?.users ? target.users : []);

    useLayoutEffect(() => {
        return () => {
            hideDialog(TARGET_EDIT_DIALOG_NAME);
        };
    }, []);

    return (
        <PageWrapper>
            {(target && target.users && target.info && target.quotes && target.stats) && (
                <div>
                    <OverviewHeader targetId={props.targetId} title={target.info.title} description={target.info.description}
                                    users={target.users ? target.users : []} permissions={permissions}/>
                    <OverviewSummary createdOn={target.info.createdOn} permissions={permissions}
                                     quotesSummarized={summarizeQuotes(target.quotes, target.stats)}/>
                    <OverviewStats stats={
                        {
                            today: buildSimpleStats(target.quotes, target.stats?.today),
                            full: buildSimpleStats(target.quotes, target.stats?.full)
                        }
                    }/>
                    <EditTargetDialog name={TARGET_EDIT_DIALOG_NAME}
                                      maxTitleLength={MAX_TITLE_LENGTH}
                                      maxDescriptionLength={MAX_DESCRIPTION_LENGTH}
                                      saveAction={(targetId, title, description) => {
                                          updateTarget(targetId, {title: title, description: description});
                                      }}/>
                </div>
            )}
        </PageWrapper>
    );
};

export default OverviewPage;