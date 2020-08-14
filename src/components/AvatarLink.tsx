import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {IAvatar} from "../entity/user";
import {makeStyles} from "@material-ui/core/styles";
import {AppContext, fb} from "../app/App";

const styles = makeStyles( () => ({
    avatar: {
        height: 40,
        width: 40,
        borderRadius: "50%",
    },
}));

const DEFAULT_AVATAR = require('./default-avatar.png')

export const AvatarLink = (props:IAvatar) => {
    const classes = styles();
    const context = useContext(AppContext);

    return (
        <Link to={fb.auth().currentUser?.uid === props.userId ? `/profile` : `users/${props.userId}`}>
            <img
                className={classes.avatar}
                src={
                    props.avatar
                        ? props.avatar
                        : DEFAULT_AVATAR
                }
            />
        </Link>
    )
}