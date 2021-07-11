import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

const useStyle = makeStyles((theme) => ({
  info: {
    marginBottom: theme.spacing(2),
  },
  infoHeader: {
    fontWeight: theme.typography.fontWeightBold,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  tag: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function MangaInfo({ manga }) {
  const classes = useStyle();

  const description = manga.data.attributes.description.en || "Unknown";
  const contentRating = manga.data.attributes.contentRating || "Unknown";
  const demographic = manga.data.attributes.publicationDemographic || "Unknown";
  const status = manga.data.attributes.status || "Unknown";
  const altTitles =
    manga.data.attributes.altTitles?.map((t) => t.en)?.join(", ") || "Unknown";
  const tags = manga.data.attributes.tags;
  const tagNames = [];
  if (tags && tags.length > 0) {
    tags.forEach((t) => tagNames.push(t.attributes.name.en));
  }

  return (
    <>
      <Typography className={classes.info}>
        <span className={classes.infoHeader}>Description:</span>{" "}
        <span className={classes.capitalize}>{description}</span>
      </Typography>

      <Typography className={classes.info}>
        <span className={classes.infoHeader}>Tags:</span>{" "}
        {tagNames.length === 0 && `Unknown`}
        {tagNames.length > 0 &&
          tagNames.map((tag) => (
            <Chip
              key={tag}
              component="span"
              className={`${classes.capitalize} ${classes.tag}`}
              label={tag}
            />
          ))}
      </Typography>

      <Typography className={classes.info}>
        <span className={classes.infoHeader}>Rating:</span>{" "}
        <Chip
          component="span"
          className={classes.capitalize}
          label={contentRating}
        />
      </Typography>

      <Typography className={classes.info}>
        <span className={classes.infoHeader}>Demographic:</span>{" "}
        <span className={classes.capitalize}>{demographic}</span>
      </Typography>

      <Typography className={classes.info}>
        <span className={classes.infoHeader}>Status:</span>{" "}
        <span className={classes.capitalize}>{status}</span>
      </Typography>

      <Typography className={classes.info}>
        <span className={classes.infoHeader}>Alternative titles:</span>{" "}
        <span className={classes.capitalize}>{altTitles}</span>
      </Typography>
    </>
  );
}

export default MangaInfo;
