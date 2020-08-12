import React from "react";
import { IServerPost } from "../../entity/post";
import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface IProps {
    post?: IServerPost;
}

const styles = makeStyles(() => ({
    card: {
        width: "100%",
        padding: 15,
    },
    text: {
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
}));

export const PostArticle = (props: IProps) => {
    const classes = styles();

    return (
        <Card className={classes.card} variant={"outlined"}>
            <Typography variant="h4" align={"center"}>
                {props.post?.name}
            </Typography>
            <Typography variant="body1" paragraph={true} className={classes.text}>
                {props.post?.text}
            </Typography>
        </Card>
    );
};
