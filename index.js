const env = require('./lib/env');
env.processEnvironment();
const express = require("express");
const cors = require('cors');
const serverless = require("serverless-http");
const dblib = require('./lib/db');

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://development.thingoncloud.com', 'https://www.thingoncloud.com'], //(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/models/:modelId", async function (req, res) {
  const data = await dblib.queryItemByIndex('modelId', 'id = :modelId', { ':modelId': req.params.modelId });
  if (data) {
    if (data.published) {
      res.json(data);
      return;
    }
  }
  res.status(404).json({ error: 'Model not found' });
});

app.get("/models", async function (req, res) {
  let published = true;
  if (req.query.published === 'false') {
    published = false;
  }
  const data = await dblib.fetchPublishedModels(published);
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

// {
//   "modelsRepoUrls": [
//       "https://bvu4yujc2fonmgmjdco6s6aknq0yjjxq.lambda-url.eu-west-2.on.aws",
//       "https://bvu4yujc2fonmgmjdco6s6aknq0yjjxq.lambda-url.eu-west-2.on.aws",
//       "https://bvu4yujc2fonmgmjdco6s6aknq0yjjxq.lambda-url.eu-west-2.on.aws"
//   ]
// }

app.post("/myregistry", async function (req, res) {
  const { modelsRepoUrls } = req.body;
  const models = [];
  for (const modelsRepoUrl of modelsRepoUrls) {
    const modelsx = await dblib.queryItemsByServiceUrl(modelsRepoUrl);
    for (const modelx of modelsx) {
      models.push(modelx);
    }
  }
  res.json(models);
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
  let updatedCounter = 0;
  for (const model of models) {
    const added = await dblib.addItem(model);
    if (added) {
      updatedCounter++;
    }
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
  const modelsAdded = parseInt(models.length) - parseInt(updatedCounter);
  const responseBody = { modelsAdded: modelsAdded, modelsUpdated: updatedCounter, modelsDeleted: deletedCounter, status: 'success' };
  res.json(responseBody);
});

app.delete("/registry", async function (req, res) {
  const { modelsRepoUrl } = req.body;
  const modelsDeleted = await dblib.deleteItemsByServiceUrl(modelsRepoUrl);
  const responseBody = {
    modelsDeleted: modelsDeleted,
    status: 'success'
  };
  res.json(responseBody);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

env.listenLocal(app);

module.exports.handler = serverless(app);