#!/usr/bin/env node

const https = require("https");

// Required Environment Variables
const email = process.env.ET_EMAIL;

if (!email) {
  console.log("add the following to your .zshrc file: ");
  console.log('export ET_EMAIL="your.name@evertrue.com"');
  return;
}
const jiraToken = process.env.JIRA_API_TOKEN;

if (!jiraToken) {
  console.log("You do not have your JIRA API Token Stored.");
  console.log(
    "To create a JIRA API Token, go here: https://id.atlassian.com/manage-profile/security/api-tokens"
  );
  console.log("Save the token and add it to your .zshrc file like so:");
  console.log('export JIRA_API_TOKEN="<your_token_goes_here>"');
  return;
}

const encoded = Buffer.from(`${email}:${jiraToken}`).toString("base64");

// Required Argument: Jira Key or URL
const jiraArg = process.argv[2];

if (!jiraArg) {
  console.log("You must supply a Jira Issue Key or URL");
  return;
}

console.log(jiraArg);

// fetch info from Jira
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Basic ${encoded}`,
};

const options = {
  auth: encoded,
  headers,
};

https
  .get(
    "https://evertroops.atlassian.net/rest/api/2/issue/ET-24711?fields=summary",
    options,
    (res) => {
      const { statusCode } = res;
      const contentType = res.headers["content-type"];

      let error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(
          "Invalid content-type.\n" +
            `Expected application/json but received ${contentType}`
        );
      }
      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }
  )
  .on("error", (err) => {
    console.log("Error: ", err.message);
  });
