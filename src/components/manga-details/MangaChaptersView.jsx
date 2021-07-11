import { useState, useEffect } from "react";
import { getMangaChaptersFeed } from "../../services/manga-service";
import MangaChapterCard from "./MangaChapterCard";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles({
  w100: {
    width: "100%",
  },
});

const LIMIT = 20;

function MangaChaptersView({ mangaId }) {
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [total, setTotal] = useState(0);
  const [moreLoading, setMoreLoading] = useState(false);

  const classes = useStyle();

  useEffect(() => {
    (async () => {
      setMoreLoading(true);
      try {
        let chapterData = await getMangaChaptersFeed(mangaId, {
          offset,
          limit: LIMIT,
        });
        console.log(chapterData);
        setTotal(chapterData.total);
        setChapters((chapters) => chapters.concat(chapterData.results));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setMoreLoading(false);
        setLoading(false);
      }
    })();
  }, [offset]);

  function loadMore() {
    setOffset((o) => o + LIMIT);
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
