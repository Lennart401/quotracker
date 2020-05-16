import React from "react";
import { useTitle } from "hookrouter";
import PageWrapper from "../../components/top-level/page/page-wrapper";
import PageTitle from "../../components/top-level/page/page-title";
import BackLink from "../../components/top-level/back-link";
import Typography from "@material-ui/core/Typography";

const StatsPage = (props) => {
    useTitle("Statistik - SLv2");
    // const quotes = useQuotes(props.targetId, 30);
    // const records = useRecords(props.targetId);

    return (
        <PageWrapper>
            <PageTitle title="Statistik"/>
            <BackLink href={"overview"}/>

            <Typography variant="body1">Hier wird in der nächsten Version die Statistik aller Sprüche zu sehen sein.</Typography>

            {/*{quotes && (*/}
            {/*    <p>{JSON.stringify(quotes)}</p>*/}
            {/*)}*/}

            {/*{records && (*/}
            {/*    <p>{JSON.stringify(records)}</p>*/}
            {/*)}*/}
        </PageWrapper>
    );
};

export default StatsPage;