const express = require("express");
const serverless = require("serverless-http");
const dblib = require('./lib/db');
const env = require('./lib/env');

env.processEnvironment();
const app = express();

app.use(express.json());

app.get("/models/:modelId", async function (req, res) {
  const data = await dblib.queryItemByIndex('modelId', 'id = :modelId', {':modelId': req.params.modelId});
  res.json( data );
});

app.get("/models", async function (req, res) {
  const data = await dblib.scanTable();
  res.json( data );
});

app.get("/version", async function (req, res) {
  const data = {
    version: "0.1.0",
    production: false,
    infrastructure: process.env.DEPLOYMENT === 'infrastructure',
    dbRegion: process.env.DBREGION || ""
  }
  res.json( data );
});

app.get("/registry", async function (req, res) {
  const data = { modelId: "4fe2" };
  res.json( data );
});

app.post("/registry", async function (req, res) {
  const { modelsRepoUrl } = req.body;
  if (typeof modelsRepoUrl !== "string") {
    res.status(400).json({ error: '"modelsRepoUrl" must be a string' });
  } 

  res.status(500).json({ error: "Could not create user" });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

env.listenLocal(app);

module.exports.handler = serverless(app);
