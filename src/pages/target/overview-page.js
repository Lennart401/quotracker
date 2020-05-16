import React from "react";
import { useTitle } from "hookrouter";
import PageWrapper from "../../components/top-level/page/page-wrapper";
import OverviewHeader from "../../components/target/overview/overview-header";
import OverviewSummary from "../../components/target/overview/overview-summary";
import OverviewStats from "../../components/target/overview/overview-stats";
import { useOverview } from "../../redux/apiv2/hooks";
import { updateTarget } from "../../redux/apiv2/actions";
import EditTargetDialog from "../../components/top-level/targets/edit-target-dialog";
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, TARGET_EDIT_DIALOG_NAME } from "../top-level/all-targets-page";
import { usePermissions } from "../../redux/permissions";

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
    useTitle("Übersicht - SLv2");
    const target = useOverview(props.targetId);
    const permissions = usePermissions(target?.users ? target.users : []);

    return (
        <PageWrapper>
            {(target && target.users && target.info && target.quotes && target.stats) && (
                <div>
                    <OverviewHeader id={props.targetId} title={target.info.title} description={target.info.description}
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
                                      }}
                    />
                </div>
            )}
        </PageWrapper>
    );
};

export default OverviewPage;