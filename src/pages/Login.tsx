import React from "react";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const styles = makeStyles(() => ({
    container: {
        height: "100vh",
        position: "relative",
    },
    card: {
        padding: 20,
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 600,
        transform: "translate(-50%, -50%)",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
    },
    register: {
        textDecoration: "none",
    },
    root: {
        marginLeft: "auto",
    },
}));

export const Login = () => {
    const classes = styles();

    return (
        <div className={classes.container}>
            <Card className={classes.card} variant="outlined">
                <TextField id="standard-basic" label="Email" />
                <TextField id="standard-basic" label="Password" />
                <Button variant="contained" color="primary">
                    Login
                </Button>
                <Typography className={classes.root}>
                    <Link className={classes.register} to={"/register"}>Register</Link>
                </Typography>
            </Card>
        </div>
    );
};
