import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
  prevBtn: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginBottom: 0,
    },
  },
}));

function ChapterNavigator({ isPrevDisabled, isNextDisabled, onNext, onPrev }) {
  const classes = useStyle();

  return (
    <Box py={3} className={classes.root}>
      <Button
        className={classes.prevBtn}
        variant="outlined"
        startIcon={<FaArrowLeft />}
        disabled={isPrevDisabled}
        onClick={onPrev}
      >
        Previous
      </Button>
      <Button
        variant="outlined"
        endIcon={<FaArrowRight />}
        disabled={isNextDisabled}
        onClick={onNext}
      >
        Next
      </Button>
    </Box>
  );
}

export default ChapterNavigator;
