import React, { useEffect, useState } from "react";
import { transport } from "../../services/Transport";
import { IApiPost } from "./apiEntity";
import {
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    container: {
        position: "relative",
        marginTop: 80,
        padding: 50,
    },
    formControl: {
        margin: 10,
        minWidth: 500,
    },
    card: {
        padding: 20,
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
        width: "100%",
        boxSizing: "border-box",
    },
    text: {
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    content: {
        overflow: "hidden",
    },
}));

export const Test = () => {
    const classes = useStyles();
    const [posts, setPosts] = useState<IApiPost[]>([]);
    const [post, setPost] = useState<IApiPost>();
    const [formTitle, setFormTitle] = useState("");

    useEffect(() => {
        transport.get("/posts").then((response: any) => {
            setPosts(response);
        });
    }, []);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        transport.get(`posts/${event.target.value}`).then((response: any) => {
            setFormTitle(event.target.value as string);
            setPost(response);
        })
    };

    return (
        <div className={classes.container}>
            <FormControl className={classes.formControl}>
                <InputLabel>Posts</InputLabel>
                <Select value={formTitle} onChange={handleChange}>
                    {posts.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                            {item.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {post && (
                <Card className={classes.card} variant={"outlined"}>
                    <CardHeader title={post?.title || "Title"} />
                    <CardContent className={classes.content}>
                        <Typography className={classes.text}>{post?.body || "Text"}</Typography>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
