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

export {
  getCoverIdsFromMangaList,
  getRelationshipObj,
  populateMangaWithCoverFile,
};
