import React, {useEffect, useState} from "react";
import {Card, Typography} from "@material-ui/core";
import {PostsTable} from "../../components/PostsTable";
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router";
import {fb} from "../../app/App";
import {IUserData} from "../../entity/user";
import {IServerPost} from "../../entity/post";
import {UserPostsTable} from "./UserPostsTable";


const styles = makeStyles(() => ({
    container: {
        marginTop: "64px",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr",
        justifyItems: "flex-end",
        gridColumnGap: 40,
        padding: "20px 100px 20px 50px",
        alignItems: "flex-start",
    },
    Card: {
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
    const {userId} = useParams();
    const [userAvatar, setUserAvatar] = useState("");
    const [userPosts, setUserPosts] = useState<IServerPost[]>([]);
    const [userLogin, setUserlogin] = useState("")

    useEffect( () => {
        fb.database().ref(`users/${userId}`).on("value", async (snapshot) => {
            const userData:IUserData = snapshot.val();
            if (userData && userData.avatar) {
                const avatar:string = await fb.storage().ref(userData.avatar).getDownloadURL()
                setUserAvatar(avatar)
                setUserlogin(userData.login)
            };
        })
    }, [])

    useEffect( () => {
        fb.database().ref(`posts/${userId}`).on("value", (snapshot) => {
            const userPostsData = snapshot.val();
            if (userPostsData) {
                const postsData:IServerPost[] = Object.values(userPostsData);
                setUserPosts(postsData)
            } else {
                setUserPosts([]);
            }
        })
    },[])

    return (
        <div className={classes.container}>
            <div className={classes.avatarContainer}>
                <img className={classes.avatar} src={userAvatar || DEFAULT_AVATAR} />
            </div>
            <div className={classes.informationContainer}>
                <Card className={classes.Card} variant="outlined">
                    <Typography variant="h5" component="h4">
                        {userLogin}
                    </Typography>
                </Card>
                <UserPostsTable userPosts={userPosts}/>
            </div>
        </div>
    )
}