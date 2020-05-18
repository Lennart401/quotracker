import Button from "@material-ui/core/Button";
import { setLinkProps } from "hookrouter";
import Chip from "@material-ui/core/Chip";
import React from "react";
import Link from "@material-ui/core/Link";
import { navigateWithDelay } from "../../../logic/navigation/navigate-with-delay";
import IconButton from "@material-ui/core/IconButton";

export const LinkedButton = (props) => {
    return (
        <Button {...props} onClick={event => {
            event.preventDefault();
            navigateWithDelay(props.href);
        }}>
            {props.children}
        </Button>
    );
    //return <Button {...setLinkProps(props)}/>; //variant={props.variant} color={props.color}
};

export const LinkedIconButton = (props) => {
    return (
        <IconButton {...props} onClick={event => { // @TODO verify with actually works like the LinkedButton
            event.preventDefault();
            navigateWithDelay(props.href);
        }}>
            {props.children}
        </IconButton>
    );
    //return <IconButton {...setLinkProps(props)}>{props.children}</IconButton>
};

export const LinkedChip = (props) => {
    return <Chip {...props} onClick={event => {
        event.preventDefault();
        navigateWithDelay(props.href);
    }}/>;
    // return <Chip onClick={() => {
    //     navigate(props.href);
    // }} avatar={props.avatar} label={props.label} onDelete={props.onDelete} className={props.className}/>;
};

export const LinkedLink = (props) => {
    return <Link {...setLinkProps(props)}/>;
};