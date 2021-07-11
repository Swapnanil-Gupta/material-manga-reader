import { makeStyles, useTheme } from "@material-ui/core/styles";
import React from "react";
import Masonry from "react-masonry-css";
import MangaGridCard from "./MangaGridCard";

const useStyle = makeStyles((theme) => ({
  grid: {
    display: "flex",
    marginLeft: -theme.spacing(2) /* gutter size offset */,
    width: "auto",
  },
  column: {
    paddingLeft: theme.spacing(2) /* gutter size */,
    backgroundClip: "padding-box",
  },
}));

function MangaGridView({ mangaList }) {
  const classes = useStyle();
  const theme = useTheme();
  const breakPointCols = {
    default: 4,
    [theme.breakpoints.values.lg]: 3,
    [theme.breakpoints.values.sm]: 2,
  };

  return (
    <Masonry
      breakpointCols={breakPointCols}
      className={classes.grid}
      columnClassName={classes.column}
    >
      {mangaList.map((manga) => (
        <MangaGridCard key={manga.data.id} manga={manga} />
      ))}
    </Masonry>
  );
}

export default MangaGridView;
