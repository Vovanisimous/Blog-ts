import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { fb } from "../app/App";
import { auth } from "firebase";
import {kMaxLength} from "buffer";
import {v4} from "uuid";

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
    const database = fb.database();
    const inputProps = {
        maxLength: 40,
    };


    const usersArticle = () => {
        const key = fb.auth().currentUser?.uid;
        database.ref(`posts/${key}/${v4()}`).set({ name, text });
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
                inputProps = {inputProps}
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
            <Button variant="contained" color="primary" fullWidth onClick={usersArticle}>
                Upload
            </Button>
        </div>
    );
};
