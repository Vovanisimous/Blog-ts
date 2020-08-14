import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { fb } from "../app/App";
import { v4 } from "uuid";
import { Alert } from "@material-ui/lab";
import moment from "moment";

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

export const CreateArticle = () => {
    const classes = styles();
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [postSuccess, setPostSuccess] = useState(false);
    const [postError, setPostError] = useState(false);
    const database = fb.database();
    const inputProps = {
        maxLength: 40,
    };

    const createArticle = () => {
        const userId = fb.auth().currentUser?.uid;
        // TODO: сделать проверку на пустые значения полей {DONE!}
        // TODO: сделать проверку на уже существующую статью с таким же именем
        const createDate = moment().toISOString();
        const postId = v4();
        if (name.length > 0 && text.length > 0) {
            database
                .ref(`posts/${userId}/${postId}`)
                .set({ name, text, userId, createdAt: createDate, id: postId })
                .then(() => {
                    setName("");
                    setText("");
                    setPostSuccess(true);
                });
        } else {
            setPostError(true);
        }
    };

    return (
        <div className={classes.container}>
            <Typography variant="h3" component="h1">
                Write your own article
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
            <Button variant="contained" color="primary" fullWidth onClick={createArticle}>
                Upload
            </Button>
            {postSuccess && <Alert severity="success">Your post has been added!</Alert>}
            {postError && <Alert severity="error">{postError }</Alert>}
        </div>
    );
};
