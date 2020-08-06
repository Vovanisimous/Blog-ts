import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { fb } from "../app/App";
import { Alert } from "@material-ui/lab";
import { useFile } from "../hooks/useFile";

const styles = makeStyles(() => ({
    container: {
        marginTop: "64px",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        justifyItems: "center",
        gridColumnGap: 40,
        padding: 50,
        alignItems: "flex-start",
    },
    Card: {
        padding: 20,
        width: 600,
        gridArea: "email",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
        marginTop: "30px",
    },
    avatar: {
        height: "400px",
        borderStyle: "solid",
        borderColor: "gray",
        width: "100%"
    },
    avatarContainer: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
        width: 300
    },
    inputFile: {
        display: "none",
    },
}));

export const Profile = () => {
    const classes = styles();
    const [email, setEmail] = useState("");
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [emailError, setEmailError] = useState<undefined | string>(undefined);
    const [userName, setUserName] = useState("");
    const [userNameSuccess, setUserNameSuccess] = useState(false);
    const [userNameError, setUserNameError] = useState<undefined | string>(undefined);
    const [pass, setPass] = useState("");
    const [repeatPass, setRepeatPass] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passSuccess, setPassSuccess] = useState(false);
    const [passError, setPassError] = useState<undefined | string>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);
    const { src, loadFile } = useFile({ whiteList: ["jpg", "png"], maxFileSize: 2097152 });

    useEffect(() => {
        const currentUser = fb.auth().currentUser;
        if (currentUser && currentUser.email) {
            setEmail(currentUser.email);
        }
        if (currentUser && currentUser.displayName) {
            setUserName(currentUser.displayName);
        }
    }, [fb.auth().currentUser]);

    const onEmailChange = () => {
        fb.auth()
            .currentUser?.updateEmail(email)
            .then(() => setEmailSuccess(true))
            .catch((error) => setEmailError(error.message));
    };

    const onUserNameChange = () => {
        fb.auth()
            .currentUser?.updateProfile({ displayName: userName })
            .then(() => setUserNameSuccess(true))
            .catch((error) => setUserNameError(error.message));
    };

    const onPassChange = () => {
        const user = fb.auth().currentUser;
        if (user) {
            if (pass === repeatPass) {
                user.updatePassword(pass)
                    .then(() => setPassSuccess(true))
                    .catch((error) => {
                        if (error.code === "auth/requires-recent-login") {
                            if (user.email) {
                                const credentials = fb.auth.EmailAuthProvider.credential(
                                    user.email,
                                    currentPassword,
                                );
                                user.reauthenticateWithCredential(credentials)
                                    .then(onPassChange)
                                    .catch((e) => setPassError(e.message));
                            }
                        } else {
                            setPassError(error.message);
                        }
                    });
            } else {
                setPassError("Passwords aren't equal");
            }
        }
    };

    const openWindow = () => {
        if (!inputRef.current) {
            return;
        }
        inputRef.current.click();
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (!file) {
            return;
        }
        loadFile(file);
    };

    return (
        <div className={classes.container}>
            <div className={classes.avatarContainer}>
                <img
                    className={classes.avatar}
                    src={src}
                />
                <input type="file" className={classes.inputFile} ref={inputRef} onChange={onChange} />
                <Button variant="contained" color="primary" fullWidth onClick={openWindow}>
                    Choose image
                </Button>
                <Button variant="contained" color="primary" fullWidth>
                    Upload
                </Button>
            </div>
            <div>
                <Card className={classes.Card} variant="outlined">
                    <Typography component={"h3"}>Your email:</Typography>
                    <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={onEmailChange}>
                        Change your email
                    </Button>
                    {emailSuccess && <Alert severity="success">Email successfully changed!</Alert>}
                    {emailError && <Alert severity="error">{emailError}</Alert>}
                </Card>
                <Card className={classes.Card} variant="outlined">
                    <Typography component={"h3"}>Your username:</Typography>
                    <TextField value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={onUserNameChange}>
                        Change your username
                    </Button>
                    {userNameSuccess && (
                        <Alert severity="success">username successfully changed!</Alert>
                    )}
                    {userNameError && <Alert severity="error">{userNameError}</Alert>}
                </Card>
                <Card className={classes.Card} variant="outlined">
                    <Typography component={"h3"}>Change your password:</Typography>
                    <TextField
                        type={"password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        type={"password"}
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                    />
                    <TextField
                        type={"password"}
                        value={repeatPass}
                        onChange={(e) => setRepeatPass(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={onPassChange}>
                        Change your password
                    </Button>
                    {passSuccess && (
                        <Alert severity="success">Password successfully changed!</Alert>
                    )}
                    {passError && <Alert severity="error">{passError}</Alert>}
                </Card>
            </div>
        </div>
    );
};
