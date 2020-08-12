import React, { useState } from "react";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

interface IProps {
    postId: string;

    onCreateComment(value: string): Promise<void>;
}

const styles = makeStyles(() => ({
    card: {
        width: "100%",
        padding: 15,
        boxSizing: "border-box",
    },
    commentButton: {
        marginTop: 15,
    },
}));

export const NewComment = (props: IProps) => {
    const classes = styles();
    const [comment, setComment] = useState("");
    const [commentSuccess, setCommentSuccess] = useState(false);
    const [commentError, setCommentError] = useState(false);

    const onUploadComment = () => {
        if (comment.length > 0) {
            props.onCreateComment(comment).then(() => {
                setCommentSuccess(true);
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
                value={comment}
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
