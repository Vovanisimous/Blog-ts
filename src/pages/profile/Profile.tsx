import React, { useContext, useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    Card,
    TextField,
    Typography
} from "@material-ui/core";
import { AppContext, fb } from "../../app/App";
import { Alert } from "@material-ui/lab";
import { useFile } from "../../hooks/useFile";
import { v4 } from "uuid";
import { useHistory } from "react-router-dom";
import {IServerPost} from "../../entity/post";
import {PostsTable} from "../../components/PostsTable";
import {Layout} from "../../components/Layout";

const styles = makeStyles(() => ({
    Card: {
        padding: 20,
        width: 600,
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
        marginTop: "30px",
    },
    avatar: {
        height: "350px",
        borderStyle: "solid",
        borderColor: "gray",
        width: "100%",
    },
    avatarContainer: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
        width: 300,
        position: "fixed",
    },
    inputFile: {
        display: "none",
    },
    informationContainer: {
        marginRight: 15,
    },
    tableContainer: {
        marginTop: 10,
    },
    postName: {
        overflow: "hidden",
    }
}));

const DEFAULT_AVATAR = require("./default-avatar.png");

export const Profile = () => {
    const history = useHistory();
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
    const [userPosts, setUserPosts] = useState<IServerPost[]>([])
    const inputRef = useRef<HTMLInputElement>(null);
    const { src, loadFile, file, setSrc } = useFile({
        whiteList: ["jpg", "png"],
        maxFileSize: 2097152,
    });
    const database = fb.database();
    const userId = fb.auth().currentUser?.uid;
    const context = useContext(AppContext);
    const currentUser = context.user;

    useEffect(() => {
        if (currentUser) {
            setSrc(currentUser.avatar);
            if (currentUser.email) {
                setEmail(currentUser.email);
            }
            if (currentUser.login) {
                setUserName(currentUser.login);
            }
        }
    }, [currentUser, setUserName, setEmail, setSrc]);

    useEffect( () => {
        database.ref(`posts/${userId}`).on("value", (snapshot) => {
            const userPostsData = snapshot.val();
            if (userPostsData) {
                const postsData:IServerPost[] = Object.values(userPostsData);
                setUserPosts(postsData)
            } else {
                setUserPosts([]);
            }
        })
    }, [])

    const onEmailChange = () => {
        context
            .updateUser({ email })
            .then(() => {
                setEmailSuccess(true);
                database.ref(`users/${userId}`).update({ email });
            })
            .catch((error) => setEmailError(error.message));
    };

    const onUserNameChange = () => {
        context
            .updateUser({ login: userName })
            .then(() => {
                setUserNameSuccess(true);
                database.ref(`users/${userId}`).update({ login: userName });
            })
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

    const onChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (!file) {
            return;
        }
        await loadFile(file);
    };

    const goToArticle = () => {
        history.push("/article");
    };

    const onUploadAvatar = () => {
        if (file) {
            const name = v4();
            fb.storage()
                .ref()
                .child(name)
                .put(file)
                .then(async () => {
                    const image = await fb.storage().ref().child(name).getDownloadURL();
                    setSrc(image);
                    database.ref(`users/${userId}`).update({ avatar: name });
                    context.updateUser({
                        avatar: image,
                    });
                });
        }
    };

    const onDeletePost = (value: string) => {
        database.ref(`posts/${userId}/${value}`).remove()
    }

    const onEditPost = (value:string) => {
        history.push(`/edit/${value}`);
    }

    return (
        <Layout>
            <div className={classes.avatarContainer}>
                <img className={classes.avatar} src={src || DEFAULT_AVATAR} />
                <input
                    type="file"
                    className={classes.inputFile}
                    ref={inputRef}
                    onChange={onChangeAvatar}
                />
                <Button variant="contained" color="primary" fullWidth onClick={openWindow}>
                    Choose image
                </Button>
                <Button variant="contained" color="primary" fullWidth onClick={onUploadAvatar}>
                    Upload
                </Button>
                <Button variant="contained" color="primary" fullWidth onClick={goToArticle}>
                    Write an article
                </Button>
            </div>
            <div className={classes.informationContainer}>
                <Card className={classes.Card} variant="outlined">
                    <Typography variant="h5" component="h4">
                        Your email:
                    </Typography>
                    <TextField value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={onEmailChange}>
                        Change your email
                    </Button>
                    {emailSuccess && <Alert severity="success">Email successfully changed!</Alert>}
                    {emailError && <Alert severity="error">{emailError}</Alert>}
                </Card>
                <Card className={classes.Card} variant="outlined">
                    <Typography variant="h5" component="h4">
                        Your username:
                    </Typography>
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
                    <Typography variant="h5" component="h4">
                        Change your password:
                    </Typography>
                    <TextField
                        type={"password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        label="Current password"
                    />
                    <TextField
                        type={"password"}
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        label="New password"
                    />
                    <TextField
                        type={"password"}
                        value={repeatPass}
                        onChange={(e) => setRepeatPass(e.target.value)}
                        label="Repeat new password"
                    />
                    <Button variant="contained" color="primary" onClick={onPassChange}>
                        Change your password
                    </Button>
                    {passSuccess && (
                        <Alert severity="success">Password successfully changed!</Alert>
                    )}
                    {passError && <Alert severity="error">{passError}</Alert>}
                </Card>
                <PostsTable userPosts={userPosts} onDeletePost={onDeletePost} onEditPost={onEditPost}/>
            </div>
        </Layout>
    );
};
