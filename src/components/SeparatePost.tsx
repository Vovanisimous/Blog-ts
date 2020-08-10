import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { IPost } from "../entity/post";
import { Link } from "react-router-dom";
import {fb} from "../app/App";
import moment from "moment";

interface IProps {
    post: IPost;
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
        boxSizing: "border-box"
    },
    link: {
        textDecoration: "none",
        display: "grid"
    },
    text: {
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    content: {
        overflow: "hidden"
    }
}));

const DEFAULT_AVATAR = require("../pages/profile/default-avatar.png");

export const SeparatePost = (props: IProps) => {
    const classes = styles();
    const { post } = props;
    const [userImage, setUserImage] = useState("")

    const getAvatar = async () => {
        const user = post.user
        if (user && user.avatar) {
            const avatarURL = await fb.storage().ref(user.avatar).getDownloadURL();
            setUserImage(avatarURL);
        } else {
            setUserImage(DEFAULT_AVATAR);
        }
    }

    useEffect( () => {
        getAvatar();
    }, [])

    return (
        <Link to={`/posts/${post.id}`} className={classes.link}>
            <Card className={classes.card} variant={"outlined"}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar} src={userImage} />
                    }
                    title={post.name}
                    subheader={moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                />
                <CardContent className={classes.content}>
                    <Typography className={classes.text}>
                        {post.text}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};
