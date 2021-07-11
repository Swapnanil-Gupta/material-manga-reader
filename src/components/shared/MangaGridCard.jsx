import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import apiConstants from "../../constants/api-constants";
import { Link } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    "&:hover": {
      boxShadow: theme.shadows[10],
    },
  },
  cover: {
    height: "15rem",
    [theme.breakpoints.up("md")]: {
      height: "22rem",
    },
  },
  title: {
    fontWeight: theme.typography.fontWeightMedium,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
  },
}));

function MangaGridCard({ manga }) {
  const id = manga.data.id;
  const coverFileName = manga.data.attributes.coverFileName;
  const cover = coverFileName
    ? `${apiConstants.COVER_BASE_URL}/${id}/${coverFileName}.256.jpg`
    : "https://via.placeholder.com/256?text=Cover+Not+Found";
  const title = manga.data.attributes.title.en;
  const classes = useStyle();

  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={`/manga/${id}`}>
        <CardMedia className={classes.cover} image={cover} title={title} />
        <CardContent>
          <Typography className={classes.title}>{title}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MangaGridCard;
