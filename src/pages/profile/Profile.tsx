import React, { useContext, useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { AppContext } from "../../app/App";
import { Alert } from "@material-ui/lab";
import { useFile } from "../../hooks/useFile";
import { v4 } from "uuid";
import { useHistory } from "react-router-dom";
import { IServerPost } from "../../entity/post";
import { PostsTable } from "../../components/PostsTable";
import { Layout } from "../../components/Layout";
import { useDatabase } from "../../hooks/useDatabase";
import moment from "moment";
import { useAuth } from "../../hooks/useAuth";
import { useStorage } from "../../hooks/useStorage";

const styles = makeStyles(() => ({
    container: {
        justifyItems: "flex-end",
        gridColumnGap: 40,
        padding: "20px 100px 20px 50px",
    },
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
    },
}));

const DEFAULT_AVATAR = require("./default-avatar.png");

export const Profile = () => {
    const history = useHistory();
    const classes = styles();
    const [creationDate, setCreationDate] = useState("");
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
    const [userPosts, setUserPosts] = useState<IServerPost[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const { src, loadFile, file, setSrc } = useFile({
        whiteList: ["jpg", "png"],
        maxFileSize: 2097152,
    });
    const database = useDatabase();
    const storage = useStorage<string>();
    const auth = useAuth();
    const context = useContext(AppContext);
    const userId = context.user?.id;
    const currentUser = context.user;
    const { data: post, fetchData: fetchPost } = useDatabase<IServerPost>();

    useEffect(() => {
        if (currentUser) {
            setSrc(currentUser.avatar);
            if (currentUser.email) {
                setEmail(currentUser.email);
            }
            if (currentUser.login) {
                setUserName(currentUser.login);
            }
            if (currentUser.createdAt) {
                setCreationDate(currentUser.createdAt);
            }
        }
    }, [currentUser, setUserName, setEmail, setSrc]);

    useEffect(() => {
        fetchPost(`posts/${userId}`, "on");
    }, [userId]);

    useEffect(() => {
        if (post) {
            const postsData: IServerPost[] = Object.values(post);
            setUserPosts(postsData);
        } else {
            setUserPosts([]);
        }
    }, [post]);

    const onEmailChange = () => {
        context
            .updateUser({ email })
            .then(() => {
                setEmailSuccess(true);
                database.updateData({ email }, `users/${userId}`);
            })
            .catch((error) => setEmailError(error.message));
    };

    const onUserNameChange = () => {
        context
            .updateUser({ login: userName })
            .then(() => {
                setUserNameSuccess(true);
                database.updateData({ login: userName }, `users/${userId}`);
            })
            .catch((error) => setUserNameError(error.message));
    };

    const onPassChange = () => {
        if (context) {
            if (pass === repeatPass) {
                context
                    .updatePassword(pass)
                    .then(() => setPassSuccess(true))
                    .catch((error) => {
                        if (error.code === "auth/requires-recent-login") {
                            if (context.user?.email) {
                                const credentials = auth.credential(
                                    context.user.email,
                                    currentPassword,
                                );
                                context
                                    .reauthenticateWithCredential(credentials)
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
            const avatarName = v4();
            storage.put(file, avatarName).then(async () => {
                const image = await storage.getChildDownloadURL(avatarName);
                setSrc(image);
                database.updateData({ avatar: avatarName }, `users/${userId}`);
                context.updateUser({
                    avatar: image,
                });
            });
        }
    };

    const onDeletePost = (value: string) => {
        database.removeData(`posts/${userId}/${value}`);
        database.removeData(`comments/${value}`);
    };

    const onEditPost = (value: string) => {
        history.push(`/edit/${value}`);
    };

    return (
        <Layout className={classes.container}>
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
                        Creation date: {moment(creationDate).format("MMMM Do YYYY, h:mm:ss a")}
                    </Typography>
                </Card>
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
                <PostsTable
                    userPosts={userPosts}
                    onDeletePost={onDeletePost}
                    onEditPost={onEditPost}
                />
            </div>
        </Layout>
    );
};
