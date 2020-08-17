import React, { useEffect, useState } from "react";
import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";
import { fb } from "../../app/App";
import { IUser } from "../../entity/user";
import { IServerPost } from "../../entity/post";
import { UserPostsTable } from "./UserPostsTable";
import { Layout } from "../../components/Layout";

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
    const [userPosts, setUserPosts] = useState<IServerPost[]>([]);
    const [user, setUser] = useState<IUser | undefined>(undefined);

    useEffect(() => {
        fb.database()
            .ref(`users/${userId}`)
            .on("value", async (snapshot) => {
                const userData: IUser = snapshot.val();
                userData.id = userId;
                if (userData && userData.avatar) {
                    userData.avatar = await fb.storage().ref(userData.avatar).getDownloadURL();
                }
                setUser(userData);
            });
    }, []);

    useEffect(() => {
        fb.database()
            .ref(`posts/${userId}`)
            .on("value", (snapshot) => {
                const userPostsData = snapshot.val();
                if (userPostsData) {
                    const postsData: IServerPost[] = Object.values(userPostsData);
                    setUserPosts(postsData);
                } else {
                    setUserPosts([]);
                }
            });
    }, []);

    return (
        <Layout className={classes.container}>
            <div className={classes.avatarContainer}>
                <img className={classes.avatar} src={user?.avatar || DEFAULT_AVATAR} />
            </div>
            <div className={classes.informationContainer}>
                <Card className={classes.card} variant="outlined">
                    <Typography variant="h5" component="h4">
                        {user?.login}
                    </Typography>
                </Card>
                <UserPostsTable userPosts={userPosts} />
            </div>
        </Layout>
    );
};
