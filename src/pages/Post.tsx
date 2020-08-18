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
import { useDatabase } from "../hooks/useDatabase";

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
    const { postId, creatorId } = useParams();
    const [comments, setComments] = useState<IComment[]>([]);
    const [userData, setUserData] = useState<IUser>();
    const context = useContext(AppContext);
    const classes = styles();
    const { data: post, fetchData: fetchPost } = useDatabase<IServerPost>();
    const { data: user, setData: setUser, fetchData: fetchUser } = useDatabase<IUser>();
    const { data: commentsData, fetchData: fetchCommentsData } = useDatabase<IComment[]>();
    const database = useDatabase<IComment>();

    useEffect(() => console.log(user), [user]);

    useEffect(() => {
        fetchPost(`/posts/${creatorId}/${postId}`, "once");
        fetchCommentsData(`comments/${postId}`, "on");
    }, []);

    useEffect(() => {
        fetchUser(`/users/${post?.userId}`, "once");
    }, [post])

    useEffect(() => {
        getUserData();
    }, [user]);

    const getUserData = async () => {
        if (user) {
            if (user?.avatar) {
                const avatar = await fb.storage().ref(user.avatar).getDownloadURL();
                setUserData({
                    id: user.id,
                    login: user.login,
                    email: user.email,
                    avatar: avatar,
                    createdAt: user.createdAt,
                });
            } else {
                setUserData({
                    id: user.id,
                    login: user?.login,
                    email: user?.email,
                    createdAt: user?.createdAt,
                });
            }
        }
    };

    useEffect(() => {
        if (commentsData) {
            const commentsObjectData: IComment[] = Object.values(commentsData);
            setComments(commentsObjectData.reverse());
        }
    }, [commentsData]);

    const onCreateComment = (value: string) => {
        const userId = context.user?.id;
        const createDate = moment().toISOString();
        const key = database.getKey();
        const data = {
            createdAt: createDate,
            comment: value,
            userId,
            commentId: key,
        };
        return database.addData(data, `comments/${postId}/${key}`);
    };

    return (
        <div className={classes.container}>
            <PostHeader user={userData} postCreatedDate={post?.createdAt} />
            <PostArticle post={post} />
            <NewComment postId={String(postId)} onCreateComment={onCreateComment} />
            <PostComments comments={comments} />
        </div>
    );
};
