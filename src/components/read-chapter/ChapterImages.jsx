import { makeStyles } from "@material-ui/core";
import LazyLoad from "react-lazyload";

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
    let imgUrl = `${server}/data/${hash}/${imgFile}`;
    console.log(imgUrl);
    return imgUrl;
  }

  return (
    <>
      {images.map((img) => (
        <LazyLoad key={img} height={200} once>
          <img
            className={classes.chapterImg}
            src={getChapterImgSrc(img)}
            alt={img}
          />
        </LazyLoad>
      ))}
    </>
  );
}

export default ChapterImages;
