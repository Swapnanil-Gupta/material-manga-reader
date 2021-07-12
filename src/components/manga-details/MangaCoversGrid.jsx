import Grid from "@material-ui/core/Grid";
import MangaCoverCard from "./MangaCoverCard";

function MangaCoversGrid({ manga, covers }) {
  return (
    <Grid container spacing={2}>
      {covers.map((cover) => (
        <Grid item xs={6} md={4} lg={3} key={cover.data.id}>
          <MangaCoverCard manga={manga} cover={cover} />
        </Grid>
      ))}
    </Grid>
  );
}

export default MangaCoversGrid;
