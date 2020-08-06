import React, { useContext } from "react";
import { AppBar, IconButton, MenuItem, Menu, Toolbar, Typography, Button } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../app/App";

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
        backgroundColor: "white"
    }
}));

export const Header = (props: IProps) => {
    const classes = styles();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const context = useContext(AuthContext);

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
    };

    const goToProfile = () => {
        setAnchorEl(null);
        history.push("/profile");
    }


    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography>
                    <Link className={classes.logo} to={"/"}>
                        myBlog.net
                    </Link>
                </Typography>
                {context ? (
                    <div className={classes.icon}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleMenu}
                        >
                            <AccountCircle />
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
                    <Button className={classes.login} onClick={() => history.push("/login")} color={"default"}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};
