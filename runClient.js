const { getAllFiles } = require("./client");

const BASE_URL = "http://localhost:3000";

getAllFiles(BASE_URL, fetch)
  .then((files) => console.log(files))
  .catch((error) => console.error(error));
