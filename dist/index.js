"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;

// src/main.js
const https = require("https");
const core = require("@actions/core");

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
    core.setOutput("joke", joke);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
