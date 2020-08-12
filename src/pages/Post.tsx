import React, { useContext, useEffect, useState } from "react";
import { AppContext, fb } from "../app/App";
import { IUser } from "../entity/user";
import { useParams } from "react-router";
import { IComment, IServerPost } from "../entity/post";
import { makeStyles } from "@material-ui/core/styles";
import { PostHeader } from "../components/PostHeader";
import { PostArticle } from "../components/PostArticle";
import { PostComments } from "../components/PostComments";
import { NewComment } from "../components/NewComment";
import moment from "moment";

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
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [comments, setComments] = useState<IComment[]>([]);
    const context = useContext(AppContext);
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
                    const data: IUser = snapshot.val();
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

    useEffect(() => {
        fb.database()
            .ref(`comments/${id}`)
            .on("value", (snapshot) => {
                const commentsObject = snapshot.val();
                if (commentsObject) {
                    const commentsObjectData: IComment[] = Object.values(commentsObject);
                    setComments(commentsObjectData.reverse());
                }
            });
    }, []);

    const onCreateComment = (value: string) => {
        const userId = context.user?.id;
        const createDate = moment().toISOString();
        const key = fb.database().ref().push().key;
        return fb.database()
            .ref(`comments/${id}/${key}`)
            .set({ createdAt: createDate, comment: value, userId })

    };

    return (
        <div className={classes.container}>
            <PostHeader user={user} />
            <PostArticle post={post} />
            <NewComment postId={String(id)} onCreateComment={onCreateComment} />
            <PostComments comments={comments} />
        </div>
    );
};
