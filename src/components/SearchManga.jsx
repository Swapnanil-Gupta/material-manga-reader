import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import Divider from "@material-ui/core/Divider";
import MangaGridView from "./MangaGridView";
import { getMangaWithCovers } from "../services/manga-service";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import If from "./If";
import { useHistory, useLocation } from "react-router-dom";
import qs from "qs";
import InfiniteScroll from "react-infinite-scroll-component";

const useStyle = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(4),
  },
  search: {
    width: "100%",
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
}));

function parseQueryParams(location) {
  return qs.parse(location.search, { ignoreQueryPrefix: true });
}

function getSearchTermFromQueryParams(queryObj) {
  let searchTerm = queryObj?.s;
  if (searchTerm) {
    return searchTerm.trim().toLowerCase();
  }
  return "";
}

function getQueryParams(location) {
  const queryObj = parseQueryParams(location);
  return {
    querySearch: getSearchTermFromQueryParams(queryObj),
  };
}

function SearchManga() {
  const classes = useStyle();

  const history = useHistory();
  const location = useLocation();
  const { querySearch } = getQueryParams(location);

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [searchInput, setSearchInput] = useState(querySearch);
  const [mangaList, setMangaList] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 30;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setSearchTerm(querySearch);
  }, [querySearch]);

  useEffect(() => {
    if (searchTerm.trim().length < 3) return;
    (async () => {
      // setLoading(true);
      setError(null);
      try {
        const data = await getMangaWithCovers({
          title: searchTerm,
          offset,
          limit,
        });
        setTotal(data.total);
        setMangaList((mangaList) => mangaList.concat(data.results));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        // setLoading(false);
      }
    })();
  }, [searchTerm, offset]);

  function searchMangaHandler(e) {
    e.preventDefault();
    let input = searchInput.trim();
    if (input.length < 3) return;
    history.push(`/search?s=${input}`);
  }

  function fetchData() {
    setOffset((o) => o + limit);
  }

  return (
    <Container component={Box} py={2}>
      <Typography className={classes.title} variant="h5">
        Search Manga
      </Typography>

      <Typography className={classes.mb2}>
        Input at least 3 characters to search.
      </Typography>
      <form onSubmit={searchMangaHandler}>
        <TextField
          className={`${classes.search} ${classes.mb2}`}
          id="search-manga"
          label="Search"
          type="search"
          variant="outlined"
          placeholder="Eg. Attack on Titan, Death Note etc."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button
          type="submit"
          color="primary"
          variant="outlined"
          className={classes.mb2}
          startIcon={<FaSearch />}
          disabled={loading || searchInput.trim().length < 3}
        >
          Search
        </Button>
      </form>

      <Divider className={classes.mb2} />

      <Typography className={classes.mb2}>Results:</Typography>
      <If condition={loading}>
        <CircularProgress color="secondary" />
      </If>
      <If condition={!loading && error}>
        <Alert variant="outlined" severity="error">
          Unable to search manga
        </Alert>
      </If>
      <If condition={!loading && !error && mangaList.length === 0}>
        <Alert variant="outlined" severity="info">
          Nothing to show
        </Alert>
      </If>
      <If condition={!loading && !error && mangaList.length > 0}>
        <InfiniteScroll
          dataLength={mangaList.length}
          next={fetchData}
          hasMore={mangaList.length !== total}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>You reached the end</p>
          }
        >
          <MangaGridView mangaList={mangaList} />
        </InfiniteScroll>
      </If>
    </Container>
  );
}

export default SearchManga;
