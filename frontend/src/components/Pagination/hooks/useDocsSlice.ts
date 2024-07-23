const useDocsSlice = <T>(limit: number, currentPage: number, docs?: T[]) => {
  if (!docs) return [];
  const total = docs.length;
  const numberOfPages = Math.ceil(total / limit);
  const lastPageLimit = limit - (numberOfPages * limit - total);
  const startIndex = (currentPage - 1) * limit;
  const endIndex =
    startIndex + (currentPage === numberOfPages ? lastPageLimit : limit);

  return docs.slice(startIndex, endIndex);
};

export default useDocsSlice;
