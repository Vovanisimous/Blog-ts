import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { AppContext } from "../app/App";
import { v4 } from "uuid";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import { useDatabase } from "../hooks/useDatabase";
import { IServerPost } from "../entity/post";
import { useHistory } from "react-router-dom";

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
    const database = useDatabase<IServerPost>();
    const context = useContext(AppContext);
    const history = useHistory();
    const inputProps = {
        maxLength: 40,
    };

    const createArticle = () => {
        const userId = context.user?.id;
        const createDate = moment().toISOString();
        const postId = v4();
        const data = {
            id: postId,
            name,
            text,
            createdAt: createDate,
            userId,
        };
        if (name.length > 0 && text.length > 0) {
            database.addData(data, `posts/${userId}/${postId}`).then(() => {
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
            {postError && <Alert severity="error">{postError}</Alert>}
        </div>
    );
};
