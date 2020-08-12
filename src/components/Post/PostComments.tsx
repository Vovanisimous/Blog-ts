import React, {useEffect, useState} from "react";
import {Card, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {SeparateComment} from "./SeparateCommnent";
import {fb} from "../../app/App";
import {useParams} from "react-router";
import {IComment} from "../../entity/post";

const styles = makeStyles( () => ({
    card: {
        width: "99%",
        padding: 15,
    },
}))

interface IProps {
    comment: IComment[];
}

export const PostComments = () => {
    const classes = styles();
    const { id } = useParams();
    const [comments, setComments] = useState([])

    useEffect( () => {
        fb.database().ref(`comments/${id}`).on("value", (snapshot) => {
            setComments(snapshot.val())
        })
        console.log(comments)
    },[])

    // useEffect( () => {
    //     fb.database().ref(`users/${comments.}`)
    // })

    return (
        <Card className={classes.card} variant={"outlined"}>
            <Typography variant={"h4"}>
                Comments:
            </Typography>
            {/*<div>*/}
            {/*    {comments.map((item) => {*/}

            {/*    })}*/}
            {/*</div>*/}
            <SeparateComment/>
        </Card>
    )
}