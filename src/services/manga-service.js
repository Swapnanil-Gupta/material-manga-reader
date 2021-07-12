import axios from "axios";
import apiConstants from "../constants/api-constants";
import {
  getCoverIdsFromMangaList,
  populateMangaWithCoverFile,
  getRelationshipObj,
} from "../utils/manga-utils";
import qs from "qs";

axios.defaults.baseURL = apiConstants.MANGADEX_BASE_URL;
axios.defaults.paramsSerializer = (params) =>
  qs.stringify(params, { encode: false });

function getManga(query) {
  return axios.get("/manga", {
    params: {
      ...query,
    },
  });
}

function getMangaById(id) {
  return axios.get(`/manga/${id}`);
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

export {
  getMangaWithCovers,
  getMangaWithCoverAndAuthorById,
  getMangaChaptersFeed,
};
