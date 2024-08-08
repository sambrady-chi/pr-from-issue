#!/usr/bin/env node
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { getEnvVariables } = require("../utils/auth");
const {
  branchify,
  isEmpty,
  onCleanBranch,
  checkoutNewBranch,
  createPr,
  pullDefault,
} = require("../utils/tools");
const {
  getJiraIssueKeyFromUrl,
  fetchIssueDetailsFromJira,
} = require("../utils/http");

const pr = async (jiraUrl) => {
  try {
    const environmentVariables = getEnvVariables();
    const jiraKey = getJiraIssueKeyFromUrl(jiraUrl);
    if (!environmentVariables || !jiraKey) return;

    const issueDetails = await fetchIssueDetailsFromJira({
      ...environmentVariables,
      key: jiraKey,
    });

    if (!issueDetails || isEmpty(issueDetails)) {
      console.log(
        "Something went wrong when fetching Issue Details from JIRA."
      );
      return;
    }

    const { fields: { summary = "" } = {}, key = "" } = issueDetails; // get relevant fields
    const branchName = branchify(key, summary);

    const onClean = await onCleanBranch();
    if (!onClean) return;

    await pullDefault();
    await checkoutNewBranch(branchName);
    const pullRequestUrl = await createPr(key, summary, jiraUrl, branchName);
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = pr;
