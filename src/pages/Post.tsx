import React, { useEffect, useState } from "react";
import { fb } from "../app/App";
import {IUserAt} from "../entity/user";
import { useParams } from "react-router";
import {IComment, IServerPost} from "../entity/post";
import { makeStyles } from "@material-ui/core/styles";
import { PostHeader} from "../components/Post/PostHeader";
import {PostArticle} from "../components/Post/PostArticle";
import {PostComments} from "../components/Post/PostComments";
import {NewComment} from "../components/Post/NewComment";

const styles = makeStyles(() => ({
    container: {
        marginTop: "64px",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr",
        justifyItems: "center",
        padding: 50,
        paddingTop: "50px",
        paddingBottom: "50px",
        alignItems: "flex-start",
        gridRowGap: 20,
    },
}));

export const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState<IServerPost | undefined>(undefined);
    const [user, setUser] = useState<IUserAt | undefined>(undefined);
    const classes = styles();

    useEffect(() => {
        fb.database()
            .ref(`/posts/${id}`)
            .once("value", (snapshot) => {
                setPost(snapshot.val());
            });
    }, []);

    useEffect(() => {
        if (post) {
            fb.database()
                .ref(`/users/${post.userId}`)
                .once("value", async (snapshot) => {
                    const data: IUserAt = snapshot.val();
                    data.id = post.userId;
                    if (data.avatar) {
                        const avatar = await fb.storage().ref(data.avatar).getDownloadURL();
                        data.avatar = avatar;
                    }
                    data.createdAt = post.createdAt;
                    setUser(data);
                });
        }
    }, [post]);

    const onCreateComment = (comment: IComment) => {

    }

    return (
        <div className={classes.container}>
            <PostHeader user={user} />
            <PostArticle post={post}/>
            <NewComment postId={String(id)} onCreateComment={onCreateComment} />
            <PostComments />
        </div>
    );
};
