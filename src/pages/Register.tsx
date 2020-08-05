import React, { FC, useState } from "react";
import { Button, Card, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { fb } from "../app/App";

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
    success: {
        color: "green",
    },
    error: {
        color: "red",
    },
}));

export const Register = () => {
    const classes = styles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState(false);

    const onRegister = () => {
        if (password !== repeatPassword) {
            setError("Passwords aren't equal!");
            return;
        }
        fb.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => setSuccess(true))
            .catch((error) => {
                setError(error.message);
                setSuccess(false);
            });
    };

    return (
        <div className={classes.container}>
            <Card className={classes.card} variant="outlined">
                <TextField
                    id="standard-basic"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    id="standard-basic"
                    type={"password"}
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    id="standard-basic"
                    type={"password"}
                    label="Confirm password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={onRegister}>
                    Register
                </Button>
                {success && <p className={classes.success}>Success!</p>}
                {error && <p className={classes.error}>{error}</p>}
            </Card>
        </div>
    );
};
