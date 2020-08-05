import React from "react";
import { AppBar, IconButton, MenuItem, Menu, Toolbar, Typography } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

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
}));

export const Header = () => {
    const classes = styles();

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography>
                    <Link className={classes.logo} to={"/"}>
                        myBlog.net
                    </Link>
                </Typography>
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
                        <MenuItem>Profile</MenuItem>
                        <MenuItem>My account</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};
