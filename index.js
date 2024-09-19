const env = require('./lib/env');
env.processEnvironment();
const express = require("express");
const serverless = require("serverless-http");
const dblib = require('./lib/db');

const app = express();

app.use(express.json());

app.get("/models/:modelId", async function (req, res) {
  const data = await dblib.queryItemByIndex('modelId', 'id = :modelId', { ':modelId': req.params.modelId });
  res.json(data);
});

app.get("/models", async function (req, res) {
  const data = await dblib.scanTable();
  res.json(data);
});

app.get("/version", async function (req, res) {
  const data = {
    version: "0.1.0",
    production: false,
    infrastructure: process.env.DEPLOYMENT === 'infrastructure',
    dbRegion: process.env.DBREGION || ""
  }
  res.json(data);
});

// Return the unique available model ID 
app.get("/registry", async function (req, res) {
  const data = { modelId: "4fe2" };
  res.json(data);
});

// Add models to Registry
app.post("/registry", async function (req, res) {
  const { modelsRepoUrl } = req.body;
  if (typeof modelsRepoUrl !== "string") {
    res.status(400).json({ error: '"modelsRepoUrl" must be a string' });
  }
  const response = await fetch(modelsRepoUrl + '/models');
  const models = await response.json();
  const modelsListNew = [];
  for (const model of models) {
    await dblib.addItem(model); 
    modelsListNew.push(model.id);
  }
  const modelsx = await dblib.queryItemsByServiceUrl(modelsRepoUrl);
  let deletedCounter = 0;
  if (modelsx) {
    for (const modelx of modelsx) {
      if (!modelsListNew.includes(modelx.id)) {
        await dblib.deleteItem(modelx.id, modelsRepoUrl);
        deletedCounter++;
      }
    }
  }
  const responseBody = { modelsUpdated: models.length, modelsDeleted: deletedCounter, status: 'success' };
  res.json(responseBody);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

env.listenLocal(app);

module.exports.handler = serverless(app);