import fetch from "node-fetch";
import redis from "redis";
import { promisify } from "util";

const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const baseURL = "https://jobs.github.com/positions.json";

const fetchGithub = async () => {
  const allJobs = [];
  let resCount = 1,
    onPage = 1;

  // pull all jobs
  while (resCount > 0) {
    const response = await fetch(`${baseURL}?page=${onPage}`);
    const jobs = await response.json();
    allJobs.push(...jobs);
    resCount = jobs.length;
    onPage++;
    console.log("got", jobs.length, "jobs");
  }
  console.log("got this many jobs", allJobs.length);

  //filter algo
  const jrJobs = allJobs.filter((job) => {
    const jobTitle = job.title.toLowerCase();

    if (
      jobTitle.includes("senior") ||
      jobTitle.includes("manager") ||
      jobTitle.includes("sr.") ||
      jobTitle.includes("architect")
    ) {
      return false;
    }

    return true;
  });

  console.log("filtered down to ", jrJobs.length);

  //store in redis
  const success = await setAsync("github", JSON.stringify(allJobs));
  console.log({ success });
};

fetchGithub();

export default fetchGithub;
