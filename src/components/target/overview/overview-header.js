import React, { Fragment } from "react";
import BackLink from "../../top-level/back-link";
import OverviewPageTitle from "./overview-page-title";
import UserChipList from "../../top-level/targets/user-chip-list";
import Caption from "../../top-level/caption";

const OverviewHeader = (props) => {
    return (
        <Fragment>
            <OverviewPageTitle id={props.id} title={props.title} description={props.description} showEditIcon={props.permissions.canEdit}/>
            <BackLink href={"/alltargets"} text="zurück zur Liste"/>
            <Caption text={props.description}/>
            <UserChipList users={props.users}/>
        </Fragment>
    );
};

export default OverviewHeader;