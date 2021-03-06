import React, { useState } from "react";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDatabase } from "../hooks/useDatabase";
import { IUserData } from "../entity/user";
import moment from "moment";

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
    login: {
        textDecoration: "none",
    },
    root: {
        marginLeft: "auto",
    },
}));

export const Register = () => {
    const classes = styles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [login, setLogin] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState(false);
    const database = useDatabase<IUserData>();
    const history = useHistory();
    const auth = useAuth();
    const createDate = moment().toISOString();

    const onRegister = () => {
        const data = {
            email,
            login,
            createdAt: createDate
        }
        if (password !== repeatPassword) {
            setError("Passwords aren't equal!");
            return;
        }
        auth.onRegister(email, login, password)
            .then(async (result) => {
                if (result.user) {
                    result.user
                        .updateProfile({
                            displayName: login,
                        })
                        .then(() => setSuccess(true))
                        .catch((error) => {
                            setError(error.message);
                            setSuccess(false);
                        });
                    await database.addData(data, `users/${result.user.uid}`)
                    history.push("/profile");
                }
            })
            .catch((error) => {
                setError(error.message);
                setSuccess(false);
            });
    };

    return (
        <div className={classes.container}>
            <Card className={classes.card} variant="outlined">
                <TextField label="Login" value={login} onChange={(e) => setLogin(e.target.value)} />
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField
                    type={"password"}
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    type={"password"}
                    label="Confirm password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={onRegister}>
                    Register
                </Button>
                <Typography className={classes.root}>
                    <Link className={classes.login} to={"/login"}>
                        Login
                    </Link>
                </Typography>
                {success && <p className={classes.success}>Success!</p>}
                {error && <p className={classes.error}>{error}</p>}
            </Card>
        </div>
    );
};
