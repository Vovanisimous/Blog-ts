import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";

interface IProps {
    className?: string;
}

const styles = makeStyles(() => ({
    container: {
        marginTop: "64px",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr",
        alignItems: "flex-start",
    },
}));

export const Layout: FC<IProps> = (props) => {
    const classes = styles();

    return <div className={classNames(classes.container, props.className)}>{props.children}</div>;
};
