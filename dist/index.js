import https from "https";
import fs from "fs";

// Inline implementation of @actions/core setOutput
function setOutput(name, value) {
  const filePath = process.env.GITHUB_OUTPUT;
  if (filePath) {
    fs.appendFileSync(filePath, `${name}=${value}\n`);
  } else {
    process.stdout.write(`::set-output name=${name}::${value}\n`);
  }
}

function setFailed(message) {
  process.exitCode = 1;
  process.stderr.write(`::error::${message}\n`);
}

function getJoke() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "icanhazdadjoke.com",
      path: "/",
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Writing JavaScript action GitHub Skills exercise.",
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.joke);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function run() {
  try {
    const joke = await getJoke();
    console.log(joke);
    setOutput("joke", joke);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
