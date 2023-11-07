const express = require("express");
const os = require("os");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const desktopDir = path.join(os.homedir(), "Desktop");

const app = express();
app.use("/files", express.static(desktopDir));

app.use("/browse/*", (req, res) => {
  const baseDir = req.params["0"];
  const data = { files: [], dir: [] };
  const dirPath = path.join(desktopDir, baseDir);
  fs.readdirSync(dirPath).forEach((file) => {
    const filepath = path.resolve(path.join(dirPath), file);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();
    if (isFile) {
      data.files.push(`files${baseDir}/${file}`);
    } else {
      data.dir.push(`browse${baseDir}/${file}`);
    }
  });
  res.json(data);
});

app.listen(5000, () => {
  const url = "http://192.168.1.37:4455/register";
  axios({
    method: "get",
    url,
  })
    .then(function (response) {
      console.log("response", JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log("app running on port 5000");
});
