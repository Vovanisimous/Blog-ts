import React from "react";
import { Card, CardHeader } from "@material-ui/core";
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

export const PostHeader = (props: IProps) => {
    const classes = styles();

    return (
        <Card className={classes.card} variant={"outlined"}>
            <CardHeader
                avatar={<AvatarLink avatarLink={props.user?.avatar} userLink={props.user?.id} />}
                title={props.user?.login}
                subheader={moment(props.user?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            />
        </Card>
    );
};
