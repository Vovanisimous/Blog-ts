import React, { useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { IUser } from "../entity/user";
import { fb } from "../app/App";
import { IPost, IPosts, IServerPost } from "../entity/post";
import { SeparatePost } from "../components/SeparatePost";

const styles = makeStyles((theme: Theme) => ({
    container: {
        position: "relative",
        marginTop: 80,
        padding: 50,
    },
    avatar: {
        backgroundColor: red[500],
    },
    posts: {
        display: "grid",
        gridRowGap: 40,
    },
}));

export const Main = () => {
    const classes = styles();
    const [posts, setPosts] = useState<IPost[]>([]);
    const [serverPosts, setServerPosts] = useState<IServerPost[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        fb.database()
            .ref("/users")
            .on("value", (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const userData: IUser[] = Object.values(data);
                    const keys = Object.keys(data);
                    setUsers(userData.map((item, index) => ({ ...item, id: keys[index] })));
                }
            });
        fb.database()
            .ref("/posts")
            .on("value", (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allPosts: Array<{ [key: string]: IServerPost }> = Object.values(data);
                    const userPosts: IServerPost[] = [];
                    allPosts.forEach((item) =>
                        Object.values(item).forEach((item) => userPosts.push(item)),
                    );
                    setServerPosts(userPosts);
                }
            });
    }, []);

    useEffect(() => {
        const postList: IPost[] = serverPosts
            .map((post) => ({
                ...post,
                user: users.find((item) => item.id === post.userId),
            }))
            .sort((a, b) => {
                const left = new Date(a.createdAt).getTime();
                const right = new Date(b.createdAt).getTime();
                return right - left;
            });
        setPosts(postList);
    }, [users, serverPosts]);

    return (
        <div className={classes.container}>
            <div className={classes.posts}>
                {posts.map((item, index) => (
                    <SeparatePost post={item} key={index} />
                ))}
            </div>
        </div>
    );
};
