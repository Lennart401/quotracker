import React, { Fragment } from "react";
import BackLink from "../../shared/back-link";
import OverviewPageTitle from "./overview-page-title";
import UsersManager from "./users/users-manager";
import Caption from "../../shared/caption";

const OverviewHeader = (props) => {
    return (
        <Fragment>
            <OverviewPageTitle targetId={props.targetId} title={props.title} description={props.description} showEditIcon={props.permissions.canEdit}/>
            <BackLink href={"/alltargets"} text="zurück zur Liste"/>
            <Caption text={props.description}/>
            <UsersManager targetId={props.targetId} users={props.users}/>
        </Fragment>
    );
};

export default OverviewHeader;