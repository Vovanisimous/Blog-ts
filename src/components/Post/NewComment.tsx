import React, { useContext, useState } from "react";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext, fb } from "../../app/App";
import moment from "moment";
import { IComment } from "../../entity/post";
import { Alert } from "@material-ui/lab";
import { v4 } from "uuid";

interface IProps {
    postId: string;

    onCreateComment(comment: IComment): void;
}

const styles = makeStyles(() => ({
    card: {
        width: "100%",
        padding: 15,
    },
    commentButton: {
        marginTop: 15,
    },
}));

export const NewComment = (props: IProps) => {
    const classes = styles();
    const database = fb.database();
    const [comment, setComment] = useState("");
    const [commentSuccess, setCommentSuccess] = useState(false)
    const [commentError, setCommentError] = useState(false);
    const context = useContext(AppContext);

    const onUploadComment = () => {
        const userId = context.user?.id;
        const createDate = moment().toISOString();
        const key = fb.database().ref().push().key
        if (comment.length > 0) {
            database
                .ref(`comments/${props.postId}/${key}`)
                .set({ createdAt: createDate, comment, userId })
                .then(() => {
                    setCommentSuccess(true)
                    setComment("");
                });
        } else {
            setCommentError(true);
        }
    };

    return (
        <Card className={classes.card} variant={"outlined"}>
            <Typography variant={"h4"}>Write a comment:</Typography>
            <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                onChange={(e) => setComment(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.commentButton}
                onClick={onUploadComment}
            >
                Upload
            </Button>
            {commentSuccess && <Alert severity="success">Your comment has been added!</Alert>}
            {commentError && <Alert severity="error">Comment field must not be empty!</Alert>}
        </Card>
    );
};
