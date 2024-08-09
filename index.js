#!/usr/bin/env node

const { program } = require("commander");
const pr = require("./commands/pr");

program
  .name("pfi")
  .description("Creates a new Pull Request when given a Jira Issue URL")
  .arguments("<string>", "Jira Issue URL")
  .action(pr);

program.parse();
