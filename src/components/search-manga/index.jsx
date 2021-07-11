import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import Divider from "@material-ui/core/Divider";
import MangaGridView from "../shared/MangaGridView";
import { getMangaWithCovers } from "../../services/manga-service";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import { useHistory, useLocation } from "react-router-dom";
import qs from "qs";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Pagination from "@material-ui/lab/Pagination";

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
  pagination: {
    marginLeft: 0,
    [theme.breakpoints.up("sm")]: {
      marginLeft: "auto",
    },
  },
}));

function parseQueryParams(location) {
  return qs.parse(location.search, { ignoreQueryPrefix: true });
}

function getPageFromQueryParams(queryObj) {
  return +queryObj?.page || 1;
}

function getPerPageFromQueryParams(queryObj) {
  return +queryObj?.perPage || 30;
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
    queryPage: getPageFromQueryParams(queryObj),
    queryPerPage: getPerPageFromQueryParams(queryObj),
    querySearch: getSearchTermFromQueryParams(queryObj),
  };
}

const perPageValues = [20, 30, 50];

function SearchManga() {
  const classes = useStyle();

  const history = useHistory();
  const location = useLocation();
  const { querySearch, queryPage, queryPerPage } = getQueryParams(location);

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [searchInput, setSearchInput] = useState(querySearch);
  const [mangaList, setMangaList] = useState([]);
  const [currentPage, setCurrentPage] = useState(queryPage);
  const [perPage, setPerPage] = useState(queryPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [total, setTotal] = useState(0);

  const totalPages = Math.min(
    Math.ceil(total / perPage),
    Math.ceil(10000 / perPage)
  );

  useEffect(() => {
    setSearchTerm(querySearch);
    setCurrentPage(queryPage);
    setPerPage(queryPerPage);
  }, [querySearch, queryPage, queryPerPage]);

  useEffect(() => {
    if (searchTerm.trim().length < 3) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMangaWithCovers({
          title: searchTerm,
          offset: (currentPage - 1) * perPage,
          limit: perPage,
        });
        setTotal(data.total);
        setMangaList(data.results);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchTerm, currentPage, perPage]);

  function searchMangaHandler(e) {
    e.preventDefault();
    let input = searchInput.trim();
    if (input.length < 3) return;
    history.push(`/search?s=${input}&page=${1}&perPage=${perPage}`);
  }

  function pageChangeHandler(page) {
    history.push(`/search?s=${searchTerm}&page=${page}&perPage=${perPage}`);
  }

  function perPageChangeHandler(e) {
    history.push(
      `/search?s=${searchTerm}&page=${1}&perPage=${+e.target.value}`
    );
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

      {loading && <CircularProgress color="secondary" />}

      {!loading && error && (
        <Alert variant="outlined" severity="error">
          Unable to search manga
        </Alert>
      )}

      {!loading && !error && mangaList.length === 0 && (
        <Alert variant="outlined" severity="info">
          Nothing to show
        </Alert>
      )}

      {!loading && !error && mangaList.length > 0 && (
        <>
          <Box mb={2} className={classes.filterWrapper}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="per-page">Per Page</InputLabel>
              <Select
                labelId="per-page"
                id="per-page"
                value={perPage}
                onChange={perPageChangeHandler}
                label="Per Page"
              >
                {perPageValues.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Pagination
              variant="outlined"
              shape="rounded"
              className={classes.pagination}
              size="large"
              showFirstButton
              showLastButton
              count={totalPages}
              page={currentPage}
              onChange={(e, p) => pageChangeHandler(p)}
            />
          </Box>

          <MangaGridView mangaList={mangaList} />

          <Box my={2} display="flex">
            <Pagination
              variant="outlined"
              shape="rounded"
              className={classes.pagination}
              size="large"
              showFirstButton
              showLastButton
              count={totalPages}
              page={currentPage}
              onChange={(e, p) => pageChangeHandler(p)}
            />
          </Box>
        </>
      )}
    </Container>
  );
}

export default SearchManga;
