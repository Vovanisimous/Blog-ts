import React, {useContext, useEffect, useState} from "react";
import {Avatar, Button, Card, CardContent, CardHeader, Typography} from "@material-ui/core";
import { IComment } from "../entity/post";
import {AppContext, fb} from "../app/App";
import { IUser } from "../entity/user";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import moment from "moment";

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
    delButton: {
      width: 40,
      marginLeft: "auto",
    },
}));

const DEFAULT_AVATAR = require("./default-avatar.png");

export const SeparateComment = (props: IProps) => {
    const [userLogin, setUserLogin] = useState("");
    const [userAvatar, setUserAvatar] = useState("");
    const classes = styles();
    const context = useContext(AppContext);
    const userId = context.user?.id;
    const commentUserId = props.comment?.userId

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

    return (
        <Card className={classes.card} variant={"outlined"}>
            <CardHeader
                avatar={<Avatar aria-label="recipe" className={classes.avatar} src={userAvatar} />}
                title={userLogin}
                subheader={moment(props.comment?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            />
            <CardContent className={classes.content}>
                <Typography className={classes.text}>{props.comment?.comment}</Typography>
            </CardContent>
            {userId == commentUserId && <Button
                variant="contained"
                color="primary"
                className={classes.delButton}
            >
                Delete
            </Button>}
        </Card>
    );
};
