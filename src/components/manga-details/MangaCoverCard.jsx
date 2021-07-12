import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import apiConstants from "../../constants/api-constants";

const useStyle = makeStyles((theme) => ({
  root: {
    "&:hover": {
      boxShadow: theme.shadows[8],
    },
  },
  thumbnail: {
    height: "15rem",
    [theme.breakpoints.up("sm")]: {
      height: "22rem",
    },
  },
}));

function MangaCoverCard({ manga, cover }) {
  const mangaId = manga.data.id;
  const coverFileName = cover.data.attributes.fileName;
  const classes = useStyle();

  if (!coverFileName) {
    return null;
  }

  const thumbnail = `${apiConstants.COVER_BASE_URL}/${mangaId}/${coverFileName}.256.jpg`;
  const coverFull = `${apiConstants.COVER_BASE_URL}/${mangaId}/${coverFileName}`;

  return (
    <Card className={classes.root}>
      <CardActionArea href={coverFull} target="_blank">
        <CardMedia image={thumbnail} className={classes.thumbnail} />
      </CardActionArea>
    </Card>
  );
}

export default MangaCoverCard;
