import React from "react";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import moment from "moment";
import { Delete, Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { IServerPost } from "../entity/post";

interface IUserPosts {
    userPosts: IServerPost[];

    onDeletePost(value: string): any;
}

const styles = makeStyles(() => ({
    tableContainer: {
        marginTop: 10,
    },
    postName: {
        overflow: "hidden",
    },
}));
export const PostsTable = (props: IUserPosts) => {
    const classes = styles();

    const onDeletePosts = (value:string): any => {
        props.onDeletePost(value)
    }

    return (
        <TableContainer className={classes.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Posts</TableCell>
                        <TableCell align="center">Creation Date</TableCell>
                        <TableCell align="center">Edit</TableCell>
                        <TableCell align="center">Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.userPosts.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell align="center" className={classes.postName}>
                                {row.name}
                            </TableCell>
                            <TableCell align="center">
                                {moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                            </TableCell>
                            <TableCell align="center">
                                <IconButton>
                                    <Edit />
                                </IconButton>
                            </TableCell>
                            <TableCell align="center">
                                <IconButton onClick={onDeletePosts(row.id)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
