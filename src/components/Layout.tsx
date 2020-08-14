import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";

const styles = makeStyles(() => ({
    container: {
        marginTop: "64px",
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr",
        justifyItems: "flex-end",
        gridColumnGap: 40,
        padding: "20px 100px 20px 50px",
        alignItems: "flex-start",
    },
}));

export const Layout: FC = (props) => {
    const classes = styles();

    return <div className={classes.container}>{props.children}</div>;
};
