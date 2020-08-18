import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";
import { IUser } from "../../entity/user";
import { IServerPost } from "../../entity/post";
import { UserPostsTable } from "./UserPostsTable";
import { Layout } from "../../components/Layout";
import { useDatabase } from "../../hooks/useDatabase";
import { useStorage } from "../../hooks/useStorage";

const styles = makeStyles(() => ({
    container: {
        justifyItems: "flex-end",
        gridColumnGap: 40,
        padding: "20px 100px 20px 50px",
    },
    card: {
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
    informationContainer: {
        marginRight: 15,
    },
}));

const DEFAULT_AVATAR = require("./default-avatar.png");

export const UserProfile = () => {
    const classes = styles();
    const { userId } = useParams();
    const [userPostsData, setUserPostsData] = useState<IServerPost[]>([]);
    const [userData, setUserData] = useState<IUser | undefined>(undefined);
    const { data: user, fetchData: fetchUser } = useDatabase<IUser>();
    const { data: posts, fetchData: fetchPosts } = useDatabase<IUser>();
    const storage = useStorage<string>()

    useEffect(() => {
        fetchUser(`users/${userId}`, "on");
        fetchPosts(`posts/${userId}`, "on")
    }, []);

    useEffect(() => {
        getUserData()
    }, [user])

    useEffect(() => {
        if (posts) {
            const postsData: IServerPost[] = Object.values(posts);
            setUserPostsData(postsData);
        } else {
            setUserPostsData([]);
        }
    }, [posts])

    const getUserData = async () => {
        if (user) {
            if (user.avatar) {
                const avatar = await storage.getDownloadURL(user.avatar)
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
                    login: user.login,
                    email: user.email,
                    createdAt: user.createdAt,
                });
            }
        }
    };

    return (
        <Layout className={classes.container}>
            <div className={classes.avatarContainer}>
                <img className={classes.avatar} src={userData?.avatar || DEFAULT_AVATAR} />
            </div>
            <div className={classes.informationContainer}>
                <Card className={classes.card} variant="outlined">
                    <Typography variant="h5" component="h4">
                        {userData?.login}
                    </Typography>
                </Card>
                <UserPostsTable userPosts={userPostsData} />
            </div>
        </Layout>
    );
};
