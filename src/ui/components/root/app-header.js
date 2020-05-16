import React, { Fragment } from 'react';
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import { A } from "hookrouter";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../../../react-auth0-spa";
import Box from "@material-ui/core/Box";
import LoadingBar from "react-redux-loading-bar";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        // textDecoration: "none",
        // color: "white"
    },
    title: {
        flexGrow: 1
    },
    offset: theme.mixins.toolbar,
}));

const AppHeader = () => {
    const classes = useStyles();
    const {isAuthenticated, logout} = useAuth0();

    return (
        <Fragment>
            <AppBar position="fixed">
                <LoadingBar
                    style={{backgroundColor: "red", height: "3px", position: "absolute"}}
                    maxProgress={95}
                    showFastActions={false}
                />
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <A href="/" className="link-no-style text-white">
                            SLv2
                        </A>
                    </Typography>
                    {isAuthenticated && (
                        <Box> {/* @TODO fix the issue with the tooltips */}
                            {/*<Tooltip title="Mein Account">*/}
                            {/*    <LinkedIconButton href={"/settings"} color="inherit">*/}
                            {/*        <PersonIcon/>*/}
                            {/*    </LinkedIconButton>*/}
                            {/*</Tooltip>*/}
                            {/*<Tooltip title="Einstellungen">*/}
                            {/*    <LinkedIconButton href={"/account"} color="inherit">*/}
                            {/*        <SettingsIcon/>*/}
                            {/*    </LinkedIconButton>*/}
                            {/*</Tooltip>*/}
                            <Button onClick={() => logout()} color="inherit">
                                AUSLOGGEN
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            <div className={classes.offset}/>
        </Fragment>
    );
};

export default AppHeader;
