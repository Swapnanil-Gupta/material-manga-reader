import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  chapterImg: {
    width: "100%",
    marginBottom: theme.spacing(3),
  },
}));

function ChapterImages({ chapter }) {
  const images = chapter.data.attributes.data;
  const hash = chapter.data.attributes.hash;
  const server = chapter.data.attributes.server.baseUrl;

  const classes = useStyle();

  function getChapterImgSrc(imgFile) {
    return `${server}/data/${hash}/${imgFile}`;
  }

  return (
    <>
      {images.map((img) => (
        <img
          className={classes.chapterImg}
          key={img}
          src={getChapterImgSrc(img)}
          alt={img}
        />
      ))}
    </>
  );
}

export default ChapterImages;
