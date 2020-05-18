import React, { Fragment } from "react";
import PageTitle from "../../shared/page-title";
import Caption from "../../shared/caption";
import HorizontalButtonGroup from "./horizontal-button-group";
import moment from "moment";

const OverviewSummary = (props) => {
    return (
        <Fragment>
            <PageTitle title="Zusammenfassung"/>
            <Caption text={`${props.quotesSummarized.amountQuotes} Sprüche und insgesamt ${props.quotesSummarized.totalRecords} Einträge seit dem ${moment(props.createdOn).format("L")}`}/>
            <HorizontalButtonGroup buttons={[
                { href: "./insert", text: "Eintragen", disabled: !props.permissions.canSubmitRecords },
                { href: "./quotes", text: "Sprüche" }
            ]}/>
        </Fragment>
    );
};

export default OverviewSummary;