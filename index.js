#!/usr/bin/env node

const { program } = require("commander");
const pr = require("./commands/pr");

program
  .name("pfi")
  .description("Creates a new Pull Request when given a Jira Issue URL")
  .arguments("<jiraUrl> [newBranchName]") // Updated to include optional branch name
  .action((jiraUrl, newBranchName) => {
    pr(jiraUrl, newBranchName); // Pass both arguments to the `pr` function
  });

program.parse();
