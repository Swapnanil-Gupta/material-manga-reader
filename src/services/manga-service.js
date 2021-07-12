import axios from "axios";
import apiConstants from "../constants/api-constants";
import {
  getCoverIdsFromMangaList,
  populateMangaWithCoverFile,
  getRelationshipObj,
  getAllChapters,
  getNextChapter,
  getPreviousChapter,
} from "../utils/manga-utils";
import qs from "qs";

axios.defaults.baseURL = apiConstants.MANGADEX_BASE_URL;
axios.defaults.paramsSerializer = (params) =>
  qs.stringify(params, { encode: false });

function getManga(query) {
  return axios.get("/manga", {
    params: {
      ...query,
      includes: ["cover_art"],
    },
  });
}

function getMangaById(id) {
  return axios.get(`/manga/${id}`, {
    params: {
      includes: ["cover_art", "author"],
    },
  });
}

function getCover(query) {
  return axios.get("/cover", {
    params: {
      ...query,
    },
  });
}

function getCoverById(id) {
  return axios.get(`/cover/${id}`);
}

function getAuthorById(id) {
  return axios.get(`/author/${id}`);
}

function getMangaFeedById(id, sortBy, query) {
  const params = {
    translatedLanguage: ["en"],
    order: {
      volume: sortBy,
      chapter: sortBy,
      updatedAt: sortBy,
    },
    ...query,
  };
  return axios.get(`/manga/${id}/feed`, { params });
}

function getCoversByMangaId(id, query) {
  return axios.get("/cover", {
    params: {
      manga: [id],
      ...query,
    },
  });
}

function getChapterById(id) {
  return axios.get(`/chapter/${id}`, {
    params: {
      includes: ["manga"],
    },
  });
}

function getChapterServer(chapterId) {
  return axios.get(`/at-home/server/${chapterId}`);
}

function getMangaAggregate(id) {
  return axios.get(`/manga/${id}/aggregate`);
}

function getChapterByNo(mangaId, chapterNo) {
  return axios.get("/chapter", {
    params: {
      manga: mangaId,
      chapter: chapterNo,
      translatedLanguage: ["en"],
    },
  });
}

async function getMangaWithCovers(query) {
  try {
    const mangaResp = await getManga(query);
    const mangaList = mangaResp.data.results;
    if (mangaList.length > 0) {
      const coverResp = await getCover({
        ids: getCoverIdsFromMangaList(mangaList),
        limit: mangaList.length,
      });
      const coversList = coverResp.data.results;
      populateMangaWithCoverFile(mangaList, coversList);
    }
    return mangaResp.data;
  } catch (err) {
    throw err;
  }
}

async function getMangaWithCoverAndAuthorById(mangaId) {
  try {
    const mangaResp = await getMangaById(mangaId);
    let manga = mangaResp.data;
    if (manga) {
      let coverId = getRelationshipObj(manga, "cover_art")?.id;
      let authorId = getRelationshipObj(manga, "author")?.id;
      let promises = [];
      if (authorId) promises.push(getAuthorById(authorId));
      if (coverId) promises.push(getCoverById(coverId));

      let resp = await Promise.all(promises);
      if (resp[0]) {
        let author = resp[0].data;
        if (author) {
          manga.data.attributes.author = author.data.attributes;
        }
      }
      if (resp[1]) {
        let cover = resp[1].data;
        if (cover) {
          manga.data.attributes.cover = cover.data.attributes;
        }
      }
      return manga;
    } else {
      throw new Error("Manga not found");
    }
  } catch (err) {
    throw err;
  }
}

async function getMangaChaptersFeed(mangaId, sortBy, query) {
  try {
    let resp = await getMangaFeedById(mangaId, sortBy, query);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

async function getMangaCovers(mangaId, query) {
  try {
    let resp = await getCoversByMangaId(mangaId, query);
    return resp.data;
  } catch (err) {
    throw err;
  }
}

async function getChapterWithServerAndManga(chapterId) {
  try {
    let resp = await Promise.all([
      getChapterById(chapterId),
      getChapterServer(chapterId),
    ]);
    let chapterResp = resp[0];
    let chapterServerResp = resp[1];
    if (!chapterResp || !chapterServerResp)
      throw new Error("Chapter/Server not found");
    let chapterData = chapterResp.data;
    let chapterServer = chapterServerResp.data;
    chapterData.data.attributes.server = chapterServer;
    chapterData.data.attributes.mangaId = getRelationshipObj(
      chapterData,
      "manga"
    )?.id;
    return chapterData;
  } catch (err) {
    throw err;
  }
}

async function getPrevAndNextChapter(mangaId, chapter) {
  try {
    let aggregateResp = await getMangaAggregate(mangaId);
    const chapterNo = +chapter.data.attributes.chapter;
    const allChapters = getAllChapters(aggregateResp.data);

    console.log(allChapters);

    const nextChapterNo = getNextChapter(chapterNo, allChapters);
    const prevChapterNo = getPreviousChapter(chapterNo, allChapters);
    console.log("next -> " + nextChapterNo);
    console.log("prev -> " + prevChapterNo);

    let returnObj = { prevChapterId: null, nextChapterId: null };

    let promises = [];
    if (prevChapterNo) {
      promises.push(getChapterByNo(mangaId, prevChapterNo));
    }
    if (nextChapterNo) {
      promises.push(getChapterByNo(mangaId, nextChapterNo));
    }
    try {
      let resp = await Promise.all(promises);

      let prevChapterResp = null;
      if (prevChapterNo && resp[0]) {
        prevChapterResp = resp[0];
      }

      let nextChapterResp = null;
      if (nextChapterNo) {
        if (prevChapterResp && resp[1]) {
          nextChapterResp = resp[1];
        }
        if (!prevChapterResp && resp[0]) {
          nextChapterResp = resp[0];
        }
      }

      console.log("prevChapterResp");
      console.log(prevChapterResp);
      console.log("nextChapterResp");
      console.log(nextChapterResp);

      if (prevChapterResp) {
        let results = prevChapterResp.data.results;
        if (results.length > 0) {
          returnObj.prevChapterId = results[0].data.id;
        }
      }

      if (nextChapterResp) {
        let results = nextChapterResp.data.results;
        if (results.length > 0) {
          returnObj.nextChapterId = results[0].data.id;
        }
      }
    } catch (err) {
      console.error(err);
    }
    console.log(returnObj);
    return returnObj;
  } catch (err) {
    throw err;
  }
}

export {
  getMangaWithCovers,
  getMangaWithCoverAndAuthorById,
  getMangaChaptersFeed,
  getMangaCovers,
  getChapterWithServerAndManga,
  getPrevAndNextChapter,
};
