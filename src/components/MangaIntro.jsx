import { makeStyles } from "@material-ui/core/styles";
import apiConstants from "../constants/api-constants";
import Typography from "@material-ui/core/Typography";

const useStyle = makeStyles((theme) => ({
  bgCover: {
    minHeight: "15rem",
    backgroundImage: (props) =>
      `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${props.coverFull})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    [theme.breakpoints.up("sm")]: {
      minHeight: "20rem",
    },
    backgroundAttachment: "fixed",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-8rem",
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginTop: "-12rem",
    },
  },
  cover: {
    height: "15rem",
    width: "12rem",
    backgroundImage: (props) => `url(${props.cover256})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up("sm")]: {
      height: "25rem",
      width: "20rem",
    },
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[5],
  },
  info: {
    width: "100%",
    textAlign: "center",
    padding: `0 ${theme.spacing(2)}px`,
    maxWidth: 500,
  },
  title: {
    marginBottom: theme.spacing(1),
  },
}));

function MangaIntro({ manga }) {
  const id = manga.data.id;
  const coverFileName = manga.data.attributes.cover.fileName;
  const coverFull = coverFileName
    ? `${apiConstants.COVER_BASE_URL}/${id}/${coverFileName}`
    : "https://via.placeholder.com/512?text=Cover+Not+Found";
  const cover256 = coverFileName
    ? `${apiConstants.COVER_BASE_URL}/${id}/${coverFileName}.256.jpg`
    : "https://via.placeholder.com/256?text=Cover+Not+Found";
  const title = manga.data.attributes.title.en;
  const author = manga.data.attributes.author?.name || "Unknown";

  const classes = useStyle({ coverFull, cover256 });

  return (
    <>
      <div className={classes.bgCover}></div>
      <div className={classes.wrapper}>
        <div className={classes.cover}></div>
        <div className={classes.info}>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
          <Typography variant="subtitle1">{author}</Typography>
        </div>
      </div>
    </>
  );
}

export default MangaIntro;
