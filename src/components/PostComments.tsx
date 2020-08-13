import React, {useEffect, useState} from "react";
import { Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SeparateComment } from "./SeparateCommnent";
import {IComment} from "../entity/post";

interface IProps {
    comments?: IComment[];
}

const styles = makeStyles(() => ({
    card: {
        width: "100%",
        padding: 15,
        boxSizing: "border-box",
    },
}));

export const PostComments = (props:IProps) => {
    const { comments = [] } = props;
    const classes = styles();

    return (
        <Card className={classes.card} variant={"outlined"}>
            <Typography variant={"h4"}>Comments:</Typography>
            <div>
                {comments.map((item) => {
                    return <SeparateComment comment={item}/>
                })}
            </div>
        </Card>
    );
};
