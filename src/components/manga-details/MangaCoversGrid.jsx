import Grid from "@material-ui/core/Grid";
import MangaCoverCard from "./MangaCoverCard";

function MangaCoversGrid({ mangaId, covers }) {
  return (
    <Grid container spacing={2}>
      {covers.map((cover) => (
        <Grid item xs={6} md={4} lg={3} key={cover.data.id}>
          <MangaCoverCard mangaId={mangaId} cover={cover} />
        </Grid>
      ))}
    </Grid>
  );
}

export default MangaCoversGrid;
