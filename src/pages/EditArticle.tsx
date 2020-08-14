import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { fb } from "../app/App";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import { useParams } from "react-router";
import {IServerPost} from "../entity/post";
import {useHistory} from "react-router-dom";

const styles = makeStyles(() => ({
    container: {
        marginTop: "64px",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr",
        justifyItems: "center",
        padding: 150,
        paddingTop: "50px",
        paddingBottom: "50px",
        alignItems: "flex-start",
        gridRowGap: 20,
    },
}));

export const EditArticle = () => {
    const classes = styles();
    const history = useHistory();
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [postSuccess, setPostSuccess] = useState(false);
    const [postError, setPostError] = useState(false);
    const database = fb.database();
    const userId = fb.auth().currentUser?.uid;
    const { postId } = useParams();
    const inputProps = {
        maxLength: 40,
    };

    useEffect( () => {
        database
            .ref(`posts/${userId}/${postId}`)
            .once("value", async (snapshot) => {
                const editedPostData:IServerPost = snapshot.val();
                setName(editedPostData.name);
                setText(editedPostData.text);
            });
    }, [])

    const editArticle = () => {
        const createDate = moment().toISOString();
        if (name.length > 0 && text.length > 0) {
            database
                .ref(`posts/${userId}/${postId}`)
                .set({ name, text, userId, createdAt: createDate, id: postId })
                .then(() => {
                    setName("");
                    setText("");
                    setPostSuccess(true);
                    history.push(`/posts/${userId}/${postId}`);
                });
        } else {
            setPostError(true);
        }
    };

    return (
        <div className={classes.container}>
            <Typography variant="h3" component="h1">
                Edit your article
            </Typography>
            <TextField
                required
                label="Article name"
                variant="outlined"
                fullWidth
                autoFocus={true}
                value={name}
                onChange={(e) => setName(e.target.value)}
                inputProps={inputProps}
            />
            <TextField
                required
                label="Article text"
                multiline
                rows={14}
                variant="outlined"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth onClick={editArticle}>
                Upload
            </Button>
            {postSuccess && <Alert severity="success">Your post has been edited!</Alert>}
            {postError && <Alert severity="error">{postError}</Alert>}
        </div>
    );
};
