import React, { useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { IUser } from "../entity/user";
import { fb } from "../app/App";
import { IComment, IPost, IPosts, IServerPost } from "../entity/post";
import { SeparatePost } from "../components/SeparatePost";
import { useDatabase } from "../hooks/useDatabase";

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
    const { data: usersData, fetchData: fetchUsersData } = useDatabase<IUser[]>()
    const { data: serverPostsData, fetchData: fetchServerPostsData } = useDatabase<IServerPost>()

    useEffect(() => {
        fetchUsersData("/users", "on")
        fetchServerPostsData("/posts", "on")
    }, [])

    useEffect ( () => {
        if(usersData) {
            const userData: IUser[] = Object.values(usersData);
            const keys = Object.keys(usersData);
            setUsers(userData.map((item, index) => ({ ...item, id: keys[index] })));
        }

        if(serverPostsData) {
            const allPosts: Array<{ [key: string]: IServerPost }> = Object.values(serverPostsData);
            const userPosts: IServerPost[] = [];
            allPosts.forEach((item) =>
                Object.values(item).forEach((item) => userPosts.push(item)),
            );
            setServerPosts(userPosts);
        }
    }, [usersData, serverPostsData])

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
