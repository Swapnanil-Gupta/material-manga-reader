import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import { FaRegClock } from "react-icons/fa";

const useStyle = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    "&:hover": {
      boxShadow: theme.shadows[8],
    },
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
  title: {
    marginBottom: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
  },
  chapter: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginBottom: 0,
    },
  },
  updateIcon: {
    marginRight: theme.spacing(1),
    position: "relative",
    top: "2px",
  },
}));

function MangaChapterCard({ mangaId, chapter }) {
  const id = chapter.data.id;
  const title = chapter.data.attributes.title || "Unknown title";
  const volume = chapter.data.attributes.volume || "Unknown";
  const chapterNo = chapter.data.attributes.chapter || "Unknown";
  const updatedAt = moment(chapter.data.attributes.updatedAt).fromNow();

  const classes = useStyle();

  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={`/manga/${mangaId}/${id}`}>
        <CardContent className={classes.wrapper}>
          <div>
            <Typography className={classes.title}>{title}</Typography>
            <Typography
              className={classes.chapter}
            >{`Volume ${volume} Chapter ${chapterNo}`}</Typography>
          </div>
          <Typography>
            <span className={classes.updateIcon}>
              <FaRegClock />
            </span>
            {updatedAt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MangaChapterCard;
