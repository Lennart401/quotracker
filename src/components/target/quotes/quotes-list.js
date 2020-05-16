import React from "react";
import List from "@material-ui/core/List";
import QuotesListItem from "./quotes-list-item";
import Divider from "@material-ui/core/Divider";

const QuotesList = (props) => {
    return (
        <List>
            {Object.entries(props.quotes).map(([id, value]) => (
                <div key={id}>
                    <Divider/>
                    <QuotesListItem id={id} text={value.text} showEdit={props.canEdit} showDelete={props.canEdit}/>
                </div>
            ))}
            <Divider/>
        </List>
    );
};

export default QuotesList;