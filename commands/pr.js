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

const pr = async (jiraUrl, newBranchName) => {
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

    //passing the optional branch name if it exists.
    const branchName = newBranchName
      ? newBranchName.slice(0, 30) // Trim newBranchName if it exceeds 30 characters
      : branchify(key, summary);

    const onClean = await onCleanBranch();
    if (!onClean) return;

    await pullDefault();
    await checkoutNewBranch(branchName, key);
    const pullRequestUrl = await createPr(key, summary, jiraUrl, branchName);
    console.log(`Successfully created your Pull Request for issue ${jiraKey}.`);
    console.log("Find your new PR here:");
    console.log("-----------------------------------------");
    console.log(pullRequestUrl);
    console.log("-----------------------------------------");
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = pr;
