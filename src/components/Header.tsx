import React, { useContext, useEffect } from "react";
import { AppBar, IconButton, MenuItem, Menu, Toolbar, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { AppContext, fb } from "../app/App";

interface IProps {
    onLogout?(): void;
}

const styles = makeStyles(() => ({
    icon: {
        marginLeft: "auto",
    },
    logo: {
        width: "100px",
        textDecoration: "none",
        color: "white",
        fontSize: "35px",
    },
    login: {
        marginLeft: "auto",
        backgroundColor: "white",
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: "50%",
    },
}));

const DEFAULT_AVATAR = require("../pages/profile/default-avatar.png");

export const Header = (props: IProps) => {
    const classes = styles();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const context = useContext(AppContext);
    const currentUser = context.user;

    useEffect(() => {
        history.listen(() => {
            setAnchorEl(null);
        });
    }, []);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const logout = () => {
        if (!props.onLogout) {
            return;
        }
        props.onLogout();
        history.push("/login");
    };

    const goToProfile = () => {
        setAnchorEl(null);
        history.push("/profile");
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography>
                    <Link className={classes.logo} to={"/"}>
                        myBlog.net
                    </Link>
                </Typography>
                {context.auth ? (
                    <div className={classes.icon}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleMenu}
                        >
                            <img
                                className={classes.avatar}
                                src={
                                    currentUser
                                        ? currentUser.avatar
                                        : DEFAULT_AVATAR
                                }
                            />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={goToProfile}>Profile</MenuItem>
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Button
                        className={classes.login}
                        onClick={() => history.push("/login")}
                        color={"default"}
                    >
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};
