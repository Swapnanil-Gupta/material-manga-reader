import { useState } from "react";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  getChapterWithServerAndManga,
  getPrevAndNextChapter,
} from "../../services/manga-service";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import ChapterImages from "./ChapterImages";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../shared/TabPanel";
import MangaChaptersView from "../shared/MangaChaptersView";
import ChapterInfo from "./ChapterInfo";
import { FaFileAlt, FaBook } from "react-icons/fa";
import ChapterNavigator from "./ChapterNavigator";

function ReadChapter() {
  const { mangaId, chapterId } = useParams();
  const history = useHistory();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [prevChapterId, setPrevChapterId] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setChapter(null);
        setPrevChapterId(null);
        setNextChapterId(null);
        setActiveTab(0);

        let chapterData = await getChapterWithServerAndManga(chapterId);
        let { prevChapterId: prevId, nextChapterId: nextId } =
          await getPrevAndNextChapter(mangaId, chapterData);

        setChapter(chapterData);
        setPrevChapterId(prevId);
        setNextChapterId(nextId);
      } catch (err) {
        console.error(err);
        setError(err);
      }
      setLoading(false);
    })();
  }, [mangaId, chapterId]);

  function gotoPrevChap() {
    history.push(`/manga/${mangaId}/${prevChapterId}`);
  }

  function gotoNextChap() {
    history.push(`/manga/${mangaId}/${nextChapterId}`);
  }

  return (
    <Container component={Box} py={2}>
      <Tabs
        value={activeTab}
        onChange={(e, n) => setActiveTab(n)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab icon={<FaFileAlt />} label="Current Chapter" />
        <Tab icon={<FaBook />} label="All Chapters" />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        {loading && <CircularProgress color="secondary" />}
        {!loading && error && (
          <Alert severity="error" variant="outlined">
            Unable to load chapter
          </Alert>
        )}
        {!loading && !error && chapter && (
          <>
            <ChapterInfo mangaId={mangaId} chapter={chapter} />
            <ChapterNavigator
              isPrevDisabled={!prevChapterId}
              isNextDisabled={!nextChapterId}
              onPrev={gotoPrevChap}
              onNext={gotoNextChap}
            />
            <Container maxWidth="md">
              <ChapterImages chapter={chapter} />
            </Container>
            <ChapterNavigator
              isPrevDisabled={!prevChapterId}
              isNextDisabled={!nextChapterId}
              onPrev={gotoPrevChap}
              onNext={gotoNextChap}
            />
          </>
        )}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <MangaChaptersView mangaId={mangaId} />
      </TabPanel>
    </Container>
  );
}

export default ReadChapter;
