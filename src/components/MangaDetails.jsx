import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMangaWithCoverAndAuthorById } from "../services/manga-service";
import If from "./If";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import MangaIntro from "./MangaIntro";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import { FaBook, FaInfo, FaPalette } from "react-icons/fa";
import MangaInfo from "./MangaInfo";
import Box from "@material-ui/core/Box";

function MangaDetails() {
  const { mangaId } = useParams();

  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        let manga = await getMangaWithCoverAndAuthorById(mangaId);
        setManga(manga);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [mangaId]);

  return (
    <>
      <If condition={loading}>
        <Container component={Box} py={2}>
          <CircularProgress color="secondary" />
        </Container>
      </If>

      <If condition={(!loading && error) || (!loading && !manga)}>
        <Container>
          <Alert severity="error" variant="outlined">
            Unable to load manga
          </Alert>
        </Container>
      </If>

      <If condition={!loading && !error && manga}>
        <MangaIntro manga={manga} />
        <Container>
          <Tabs
            value={activeTab}
            onChange={(e, n) => setActiveTab(n)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<FaInfo />} label="Info" />
            <Tab icon={<FaBook />} label="Chapters" />
            <Tab icon={<FaPalette />} label="Art" />
          </Tabs>
          <TabPanel value={activeTab} index={0}>
            <MangaInfo manga={manga} />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            Item Three
          </TabPanel>
        </Container>
      </If>
    </>
  );
}

export default MangaDetails;
