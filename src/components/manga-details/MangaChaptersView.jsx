import { useState, useEffect } from "react";
import { getMangaChaptersFeed } from "../../services/manga-service";
import MangaChapterCard from "./MangaChapterCard";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";

const useStyle = makeStyles((theme) => ({
  w100: {
    width: "100%",
  },
  filterWrapper: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
  formControl: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
    minWidth: 120,
    [theme.breakpoints.up("sm")]: {
      marginBottom: 0,
    },
  },
}));

const LIMIT = 20;

function MangaChaptersView({ manga }) {
  const id = manga.data.id;
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [total, setTotal] = useState(0);
  const [moreLoading, setMoreLoading] = useState(false);
  const [sortBy, setSortBy] = useState("desc");

  const classes = useStyle();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let chapterData = await getMangaChaptersFeed(id, sortBy, {
          offset: 0,
          limit: LIMIT,
        });
        setTotal(chapterData.total);
        setChapters(chapterData.results);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, sortBy]);

  useEffect(() => {
    if (offset === 0) return;
    (async () => {
      setMoreLoading(true);
      try {
        let chapterData = await getMangaChaptersFeed(id, sortBy, {
          offset,
          limit: LIMIT,
        });
        setTotal(chapterData.total);
        setChapters((chapters) => chapters.concat(chapterData.results));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setMoreLoading(false);
      }
    })();
  }, [id, sortBy, offset]);

  function loadMore() {
    setOffset((o) => o + LIMIT);
  }

  function sortByChangeHandler(e) {
    setOffset(0);
    setSortBy(e.target.value);
  }

  return (
    <>
      {loading && <CircularProgress color="secondary" />}
      {!loading && error && (
        <Alert severity="error" variant="outlined">
          Unable to load manga
        </Alert>
      )}
      {!loading && !error && chapters.length === 0 && (
        <Alert severity="info" variant="outlined">
          No chapters found
        </Alert>
      )}
      {!loading && !error && chapters.length > 0 && (
        <>
          <Box mb={2} className={classes.filterWrapper}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="sort-by">Sort By</InputLabel>
              <Select
                labelId="sort-by"
                id="sort-by"
                value={sortBy}
                onChange={sortByChangeHandler}
                label="Sort By"
              >
                <MenuItem value="desc">Last to first</MenuItem>
                <MenuItem value="asc">First to last</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {chapters.map((c) => (
            <MangaChapterCard key={c.data.id} chapter={c} />
          ))}

          <Button
            className={classes.w100}
            size="large"
            variant="outlined"
            onClick={loadMore}
            disabled={moreLoading || chapters.length === total}
          >
            {moreLoading ? <CircularProgress /> : "Load more"}
          </Button>
        </>
      )}
    </>
  );
}

export default MangaChaptersView;
