const BASE_URL = "http://localhost:3000";

async function getRootDirectoryData(baseUrl = BASE_URL, fetchImpl = fetch) {
  const response = await fetchImpl(baseUrl);

  if (!response.ok) {
    throw new Error("error occured while fetching the data");
  }

  return response.json();
}

async function getDirectoryFiles(baseUrl = BASE_URL, fetchImpl = fetch, directoryName) {
  const url = `${baseUrl}/${directoryName}`;
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error("error occured while fetching the directory data");
  }

  return response.json();
}

async function getAllFiles(
  baseUrl = BASE_URL,
  fetchImpl = fetch,
  getRootDirectoryDataFn = getRootDirectoryData,
  getDirectoryFilesFn = getDirectoryFiles,
) {
  const finalFilesList = [];
  const rootDirectoryData = await getRootDirectoryDataFn(baseUrl, fetchImpl);

  //if root directory includes files then store those files in array
  const rootFiles = rootDirectoryData.items.filter((eachData) => !eachData.isDir);
  const directories = rootDirectoryData.items.filter((eachData) => eachData.isDir);
  finalFilesList.push(...rootFiles);

  if (directories.length) {
    const directoryData = await Promise.all(
      directories.map((dir) => getDirectoryFilesFn(baseUrl, fetchImpl, dir.name)),
    );

    const files = directoryData.flatMap((directory) =>
      directory.files.filter((eachData) => !eachData.isDir),
    );

    finalFilesList.push(...files);
  }

  return finalFilesList;
}

module.exports = {
  getRootDirectoryData,
  getDirectoryFiles,
  getAllFiles,
};
