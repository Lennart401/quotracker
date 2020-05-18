import React from 'react';
import {navigate, useRoutes} from "hookrouter";
import NotFoundPage from "./not-found-page";
import OverviewPage from "../target/overview-page";
import InsertPage from "../target/insert-page";
import QuotesPage from "../target/quotes-page";
import StatsPage from "../target/stats-page";

const routes = {
  "/:tid": ({tid}) => { navigate(`${tid}/overview`, true) }, // @TODO find a better solution for this, it will cause an error when navigating first time to /:tid (bad setState call)
  // "/:tid/:page": ({tid, page}) => <TargetsPage tid={tid} page={page} />
  "/:tid/overview": ({tid}) => <OverviewPage targetId={tid}/>,
  "/:tid/insert": ({tid}) => <InsertPage targetId={tid}/>,
  "/:tid/quotes": ({tid}) => <QuotesPage targetId={tid}/>,
  "/:tid/statistics": ({tid}) => <StatsPage targetId={tid}/>,
};

const TargetNestedRouter = () => {
  const routeResult = useRoutes(routes);
  return routeResult || <NotFoundPage/>;
};

export default TargetNestedRouter;
