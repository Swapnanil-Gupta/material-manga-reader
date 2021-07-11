import { useState, useEffect } from "react";
import { getMangaWithCovers } from "../../services/manga-service";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MangaGridView from "../shared/MangaGridView";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Pagination from "@material-ui/lab/Pagination";
import Alert from "@material-ui/lab/Alert";
import { useHistory, useLocation } from "react-router-dom";
import qs from "qs";
import Container from "@material-ui/core/Container";

const useStyle = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(4),
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

function getSortByFromQueryParams(queryObj) {
  let sortBy = queryObj?.sortBy;
  if (sortBy) {
    sortBy = sortBy.toLowerCase();
    if (sortBy === "popular" || sortBy === "updated" || sortBy === "created") {
      return sortBy;
    }
  }
  return "popular";
}

function getQueryParams(location) {
  const queryObj = parseQueryParams(location);
  return {
    queryPage: getPageFromQueryParams(queryObj),
    queryPerPage: getPerPageFromQueryParams(queryObj),
    querySortBy: getSortByFromQueryParams(queryObj),
  };
}

const perPageValues = [20, 30, 50];

function AllManga() {
  const classes = useStyle();

  const history = useHistory();
  const location = useLocation();
  const { queryPage, queryPerPage, querySortBy } = getQueryParams(location);

  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [currentPage, setCurrentPage] = useState(queryPage);
  const [perPage, setPerPage] = useState(queryPerPage);
  const [sortBy, setSortBy] = useState(querySortBy);
  const [total, setTotal] = useState(0);

  const totalPages = Math.min(
    Math.ceil(total / perPage),
    Math.ceil(10000 / perPage)
  );

  useEffect(() => {
    setCurrentPage(queryPage);
    setPerPage(queryPerPage);
    setSortBy(querySortBy);
  }, [queryPage, queryPerPage, querySortBy]);

  useEffect(() => {
    (async () => {
      let query = {
        offset: (currentPage - 1) * perPage,
        limit: perPage,
      };
      if (sortBy === "updated") {
        query["order"] = {
          updatedAt: "desc",
        };
      }
      if (sortBy === "created") {
        query["order"] = {
          createdAt: "desc",
        };
      }

      setError(null);
      setLoading(true);
      try {
        const data = await getMangaWithCovers(query);
        setTotal(data.total);
        setMangaList(data.results);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [perPage, currentPage, sortBy]);

  function pageChangeHandler(page) {
    history.push(`/all?page=${page}&perPage=${perPage}&sortBy=${sortBy}`);
  }

  function sortByChangeHandler(e) {
    history.push(`/all?page=${1}&perPage=${perPage}&sortBy=${e.target.value}`);
  }

  function perPageChangeHandler(e) {
    history.push(`/all?page=${1}&perPage=${+e.target.value}&sortBy=${sortBy}`);
  }

  return (
    <Container component={Box} py={2}>
      <Typography className={classes.title} variant="h5">
        All Manga
      </Typography>

      {loading && <CircularProgress color="secondary" />}

      {!loading && error && (
        <Alert variant="outlined" severity="error">
          Unable to load manga
        </Alert>
      )}

      {!loading && !error && mangaList.length > 0 && (
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
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="updated">Recently Updated</MenuItem>
                <MenuItem value="created">Recently Created</MenuItem>
              </Select>
            </FormControl>

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

          <MangaGridView
            mangaList={mangaList}
            total={total}
            perPage={perPage}
            currentPage={currentPage}
            onPageChange={pageChangeHandler}
          />

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

export default AllManga;
