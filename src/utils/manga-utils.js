function getRelationshipObj(entity, type) {
  return entity.relationships.find((r) => r.type === type);
}

function getCoverIdsFromMangaList(mangaList) {
  let coverIds = [];
  mangaList.forEach((manga) => {
    let coverId = getRelationshipObj(manga, "cover_art")?.id;
    if (coverId) {
      coverIds.push(coverId);
    }
  });
  return coverIds;
}

function populateMangaWithCoverFile(mangaList, coversList) {
  for (let manga of mangaList) {
    let coverId = getRelationshipObj(manga, "cover_art")?.id;
    if (coverId) {
      const cover = coversList.find((c) => c.data.id === coverId);
      manga.data.attributes.coverFileName = cover.data.attributes.fileName;
    }
  }
}

function getAllChapters(resp) {
  let allChapters = [];
  let volumes = resp.volumes;
  for (let vol in volumes) {
    let volume = volumes[vol];
    let chapters = volume.chapters;
    for (let chap in chapters) {
      let chapter = chapters[chap];
      if (chapter.chapter) {
        let chapterNo = +chapter.chapter;
        if (chapterNo && !allChapters.includes(chapterNo)) {
          allChapters.push(chapterNo);
        }
      }
    }
  }
  allChapters.sort((a, b) => a - b);
  return allChapters;
}

function getNextChapter(chapter, allChapters) {
  let index = allChapters.findIndex((c) => c === chapter);
  if (index < 0 || index === allChapters.length - 1) {
    return null;
  } else return allChapters[index + 1];
}

function getPreviousChapter(chapter, allChapters) {
  let index = allChapters.findIndex((c) => c === chapter);
  if (index <= 0) {
    return null;
  } else return allChapters[index - 1];
}

export {
  getCoverIdsFromMangaList,
  getRelationshipObj,
  populateMangaWithCoverFile,
  getAllChapters,
  getNextChapter,
  getPreviousChapter,
};
