import React, {useContext} from "react";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {AppContext, fb} from "../app/App";

interface IProps {
    avatarLink: string;
    userLink: string;
}

const styles = makeStyles( () => ({
    avatar: {
        height: 40,
        width: 40,
        borderRadius: "50%",
    },
}));

const DEFAULT_AVATAR = require('./default-avatar.png')

export const AvatarLink = (props:IProps) => {
    const classes = styles();
    const context = useContext(AppContext);

    return (
        <Link to={context.user?.id === props.userLink ? `/profile` : `/users/${props.userLink}`}>
            <img
                className={classes.avatar}
                src={
                    props.avatarLink
                        ? props.avatarLink
                        : DEFAULT_AVATAR
                }
            />
        </Link>
    )
}