import Button from "@material-ui/core/Button";
import {navigate, setLinkProps} from "hookrouter";
import Chip from "@material-ui/core/Chip";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";

const LinkedButton = (props) => {
  return <Button {...setLinkProps(props)}/>; //variant={props.variant} color={props.color}
};

const LinkedIconButton = (props) => {
  return <IconButton {...setLinkProps(props)}>{props.children}</IconButton>
};

const LinkedChip = (props) => {
  return <Chip onClick={() => {
    navigate(props.href);
  }} avatar={props.avatar} label={props.label} onDelete={props.onDelete} className={props.className} />;
};

const LinkedLink = (props) => {
  return <Link {...setLinkProps(props)}/>;
};

export {LinkedButton, LinkedIconButton, LinkedChip, LinkedLink};