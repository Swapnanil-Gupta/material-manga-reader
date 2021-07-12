import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { FaInfoCircle } from "react-icons/fa";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  mb1: {
    marginBottom: theme.spacing(1),
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
}));

function ChapterInfo({ mangaId, chapter }) {
  const history = useHistory();

  const title = chapter.data.attributes.title || "Unknown Title";
  const chapterNo = chapter.data.attributes.chapter || "Unknown";
  const classes = useStyle();

  function backToManga() {
    history.push(`/manga/${mangaId}`);
  }

  return (
    <>
      <Box className={classes.root}>
        <Button
          className={classes.mb2}
          variant="outlined"
          startIcon={<FaInfoCircle />}
          onClick={backToManga}
          disabled={!mangaId}
        >
          View Manga Details
        </Button>
        <Typography className={classes.mb1} variant="h5">
          Chapter {chapterNo}
        </Typography>
        <Typography className={classes.mb1} variant="h6">
          {title}
        </Typography>
      </Box>
      <Divider />
    </>
  );
}

export default ChapterInfo;
