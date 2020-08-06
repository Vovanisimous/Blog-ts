import React, {useEffect} from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    IconButton,
    Typography
} from "@material-ui/core";
import clsx from 'clsx';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {fb} from "../app/App";


const styles = makeStyles ((theme:Theme) => ({
    container: {
        height: "100vh",
        position: "relative",
        marginTop: "80px"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    card: {
        padding: 20,
        position: "absolute",
        top: "40%",
        left: "50%",
        width: 600,
        transform: "translate(-50%, -50%)",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridRowGap: 20,
    }
}))

export const Main = () => {
    const classes = styles();
    const [expanded, setExpanded] = React.useState(false);


    // useEffect(() => {
    //     console.log(fb.auth().currentUser?.email);
    // }, [fb.auth().currentUser])
    return (
        <div className={classes.container}>
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            R
                        </Avatar>
                    }
                    title="Shrimp and Chorizo Paella"
                    subheader="September 14, 2016"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        This impressive paella is a perfect party dish and a fun meal to cook together with your
                        guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>

                </CardActions>
            </Card>
        </div>
    );
};
