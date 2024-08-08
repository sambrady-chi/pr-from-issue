#!/usr/bin/env node

const { program } = require("commander");
const pr = require("./commands/pr");

program
  .name("pfi")
  .description("Creates a new Pull Request when given ")
  .argument("<string>", "Jira Issue URL")
  .action(pr);

program.parse();
