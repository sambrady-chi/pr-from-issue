#!/usr/bin/env node
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { branchify } = require("../utils/tools");
const { getEnvVariables } = require("../utils/auth");
const {
  isValidUrl,
  getJiraIssueKeyFromUrl,
  fetchIssueDetailsFromJira,
} = require("../utils/http");

const pr = (jiraUrl) => {
  if (!isValidUrl(jiraUrl)) {
    console.log("Invalid Jira URL");
    return;
  }
  const environmentVariables = getEnvVariables(); // get auth information from .zshrc or bash profile
  if (!environmentVariables) return;
  const key = getJiraIssueKeyFromUrl(jiraUrl);

  fetchIssueDetailsFromJira({
    ...environmentVariables,
    key,
  }).then((data) => {
    const {
      fields: { summary },
      key,
    } = data;

    const branchName = branchify(key, summary);
    console.log(branchName);
    console.log(branchName.length);
  });
};

module.exports = pr;
