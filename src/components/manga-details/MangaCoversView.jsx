import { useEffect } from "react";
import { useState } from "react";
import { getMangaCovers } from "../../services/manga-service";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import MangaCoversGrid from "./MangaCoversGrid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import apiConstants from "../../constants/api-constants";

const useStyle = makeStyles((theme) => ({
  loadMoreBtn: {
    marginTop: theme.spacing(3),
    width: "100%",
  },
}));

const LIMIT = apiConstants.COVERS_PER_LOAD;

function MangaCoversView({ manga }) {
  const id = manga.data.id;
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moreLoading, setMoreLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const classes = useStyle();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let coversData = await getMangaCovers(id, {
          offset: 0,
          limit: LIMIT,
        });
        setTotal(coversData.total);
        setCovers(coversData.results);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (offset === 0) return;
    (async () => {
      try {
        setMoreLoading(true);
        let coversData = await getMangaCovers(id, {
          offset,
          limit: LIMIT,
        });
        setTotal(coversData.total);
        setCovers((covers) => covers.concat(coversData.results));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setMoreLoading(false);
      }
    })();
  }, [id, offset]);

  function loadMore() {
    setOffset((o) => o + LIMIT);
  }

  return (
    <>
      {loading && <CircularProgress color="secondary" />}
      {!loading && error && (
        <Alert severity="error" variant="outlined">
          Unable to load arts
        </Alert>
      )}
      {!loading && !error && covers.length === 0 && (
        <Alert severity="info" variant="outlined">
          No arts found
        </Alert>
      )}
      {!loading && !error && covers.length > 0 && (
        <>
          <MangaCoversGrid manga={manga} covers={covers} />

          <Button
            variant="outlined"
            className={classes.loadMoreBtn}
            onClick={loadMore}
            disabled={moreLoading || covers.length === total}
          >
            {moreLoading ? "Loading..." : "Load more"}
          </Button>
        </>
      )}
    </>
  );
}

export default MangaCoversView;
