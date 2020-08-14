import React, { useEffect, useState } from "react";
import { Avatar, Card, CardHeader } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IUser } from "../entity/user";
import moment from "moment";
import { AvatarLink } from "./AvatarLink";

interface IProps {
    user?: IUser;
}

const styles = makeStyles(() => ({
    card: {
        width: "100%",
    },
}));

const DEFAULT_AVATAR = require("./default-avatar.png");

export const PostHeader = (props: IProps) => {
    const classes = styles();
    const [userImage, setUserImage] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        if (props.user && props.user.avatar) {
            setUserImage(props.user.avatar);
        } else {
            setUserImage(DEFAULT_AVATAR);
        }
        if (props.user && props.user.id) {
            setUserId(props.user.id);
        }
    }, [props.user]);

    return (
        <Card className={classes.card} variant={"outlined"}>
            <CardHeader
                avatar={<AvatarLink avatarLink={userImage} userLink={userId} />}
                title={props.user?.login}
                subheader={moment(props.user?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            />
        </Card>
    );
};
