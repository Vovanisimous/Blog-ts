import React, { useEffect, useState } from "react";
import { transport } from "../../services/Transport";
import { IApiComment, IApiPost } from "./apiEntity";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl, IconButton,
    InputLabel,
    MenuItem,
    Select, TextField,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AvatarLink } from "../../components/AvatarLink";
import moment from "moment";
import { Delete, Edit } from "@material-ui/icons";

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
    const [comments, setComments] = useState<IApiComment[]>([])

    useEffect(() => {
        transport.get("/posts").then((response: any) => {
            setPosts(response);
        });
    }, []);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        transport.get(`posts/${event.target.value}`).then((response: any) => {
            setFormTitle(event.target.value as string);
            setPost(response);
            transport.get(`posts/${event.target.value}/comments`).then((commentsResponse: any) => {
                setComments(commentsResponse)
            })
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
            {comments && (
                comments.map((item) => (
                    <Card key={item.id} className={classes.card} variant={"outlined"}>
                        <CardHeader
                            title={item.name}
                        />
                        <CardContent className={classes.content}>
                            <Typography className={classes.text}>{item.body}</Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};
