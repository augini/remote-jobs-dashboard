import express from "express";
import redis from "redis";
import { promisify } from "util";
const client = redis.createClient();

//get jobs from redis
const getAsync = promisify(client.get).bind(client);

//set express app
const app = express();
const PORT = 5000;

app.get("/jobs", async (req, res) => {
  const response = await getAsync("github");
  const jobs = JSON.parse(response);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.send(jobs);
});

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
