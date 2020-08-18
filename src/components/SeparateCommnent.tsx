import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    TextField,
    Typography,
} from "@material-ui/core";
import { IComment } from "../entity/post";
import { AppContext, fb } from "../app/App";
import { IUser } from "../entity/user";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import moment from "moment";
import { Delete, Edit } from "@material-ui/icons";
import { useParams } from "react-router";
import {AvatarLink} from "./AvatarLink";
import { useDatabase } from "../hooks/useDatabase";

interface IProps {
    comment?: IComment;
}

const styles = makeStyles(() => ({
    avatar: {
        backgroundColor: red[500],
    },
    card: {
        padding: 20,
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
        width: "100%",
        boxSizing: "border-box",
        marginTop: 15,
    },
    text: {
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    content: {
        overflow: "hidden",
    },
    buttons: {
        display: "flex",
    },
    button: {
        alignItems: "flex-start",
        marginRight: 10,
    },
    uploadEditedCommentButton: {
        marginTop: 10,
    },
}));

const DEFAULT_AVATAR = require("./default-avatar.png");

export const SeparateComment = (props: IProps) => {
    const [userLogin, setUserLogin] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const [commentEditField, setCommentEditField] = useState(false);
    const [editedComment, setEditedComment] = useState("");
    const { data: userIdData, fetchData: fetchUserIdData } = useDatabase<IUser>();
    const classes = styles();
    const { id } = useParams();
    const context = useContext(AppContext);
    const userId = context.user?.id
    const commentId = props.comment?.commentId;

    useEffect(() => {
        fetchUserIdData(`users/${props.comment?.userId}`, "on");
    }, [props.comment?.userId])

    useEffect(() => {
        getUserData()
    }, [userIdData])

    useEffect(() => {
        fb.database()
            .ref(`users/${props.comment?.userId}`)
            .on("value", async (snapshot) => {
                const userIdData: IUser = snapshot.val();
                setUserLogin(userIdData.login);
                if (userIdData.avatar) {
                    const avatar = await fb.storage().ref(userIdData.avatar).getDownloadURL();
                    setUserAvatar(avatar);
                } else {
                    setUserAvatar(DEFAULT_AVATAR);
                }
            });
    }, []);

    const getUserData = async () => {
        if (userIdData) {
            setUserLogin(userIdData.login);
            if (userIdData.avatar) {
                const avatar = await fb.storage().ref(userIdData.avatar).getDownloadURL();
                setUserAvatar(avatar);
            }else {
                setUserAvatar(DEFAULT_AVATAR);
            }
        }
    }

    const onDeleteComment = () => {
        fb.database().ref(`comments/${id}/${commentId}`).remove();
    };

    const onEditComment = () => {
        setCommentEditField(!commentEditField);
        if (props.comment) {
            setEditedComment(props.comment.comment);
        }
    };

    const onUploadEditedComment = () => {
        fb.database().ref(`comments/${id}/${commentId}`).set({
            comment: editedComment,
            commentId: commentId,
            createdAt: props.comment?.createdAt,
            userId: userId,
        }).then(() => {
            setCommentEditField(false);
            setEditedComment("")
        })
    };

    return (
        <Card className={classes.card} variant={"outlined"}>
            <CardHeader
                avatar={<AvatarLink avatarLink={userAvatar} userLink={props.comment?.userId}/>}
                title={userLogin}
                subheader={moment(props.comment?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                action={
                    <>
                        {userId === props.comment?.userId && (
                            <div className={classes.buttons}>
                                <IconButton className={classes.button} onClick={onEditComment}>
                                    <Edit />
                                </IconButton>
                                <IconButton className={classes.button} onClick={onDeleteComment}>
                                    <Delete />
                                </IconButton>
                            </div>
                        )}
                    </>
                }
            />
            <CardContent className={classes.content}>
                {commentEditField ? (
                    <div>
                        <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.uploadEditedCommentButton}
                            onClick={onUploadEditedComment}
                        >
                            Upload
                        </Button>
                    </div>
                ) : (
                    <Typography className={classes.text}>{props.comment?.comment}</Typography>
                )}
            </CardContent>
        </Card>
    );
};
