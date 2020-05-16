import React, { Fragment } from "react";
import PageTitle2 from "../../shared/page-title-2";
import Caption from "../../shared/caption";
import { LinkedButton } from "../../shared/links";
import StatsListing from "./stats-listing";

const OverviewStats = (props) => {
    return (
        <Fragment>
            <PageTitle2 title="Statistik"/>

            <Caption text="Heute"> <LinkedButton variant="outlined" href={"statistics"} size="small">ANZEIGEN</LinkedButton></Caption>
            {props.stats && (
                <StatsListing quotes={
                    // props.stats.find(element => element.forTimeframe === "today").quotes
                    props.stats.today
                }/>
            )}

            <Caption text="Insgesamt"> <LinkedButton variant="outlined" href={"statistics"} size="small">ANZEIGEN</LinkedButton></Caption>
            {props.stats && (
                <StatsListing quotes={
                    // props.stats.find(element => element.forTimeframe === "full").quotes
                    props.stats.full
                }/>
            )}
        </Fragment>
    );
};

export default OverviewStats;