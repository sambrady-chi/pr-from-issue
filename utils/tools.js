const util = require("util");
const exec = util.promisify(require("child_process").exec);

const branchify = (key, summary = "") => {
  const lowerKey = String(key).toLowerCase().split(" ").join("-");
  const lowerSummary = String(summary).toLowerCase().split(" ").join("-");

  return `${lowerKey}-${lowerSummary}`
    .replace(/[^a-z0-9-]/g, "") // removes anything that is not alphanumeric or a hyphen
    .slice(0, 30) // max length 30 characters for branch, to avoid invalid deployed URL
    .trim(); // remove whitespace
};

function isEmpty(obj) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return true;
}

const pullDefault = async () => {
  console.log("Pulling Latest...");
  await exec("git pull");
};

const getDefaultBranch = async () => {
  await exec(
    "git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'"
  );
};

const getCurrentBranch = async () => {
  await exec("git rev-parse --abbrev-ref HEAD");
};

const onCleanBranch = async () => {
  const currentBranch = await getCurrentBranch();
  const defaultBranch = await getDefaultBranch();

  if (currentBranch === defaultBranch) {
    return true;
  } else {
    console.log(
      "You must be on 'main' or 'master' branch and have no outstanding changes to begin."
    );
    console.log(" ");
    console.log(
      "git checkout main/master and ensure working tree is clean before retrying."
    );
    return false;
  }
};

const checkoutNewBranch = async (branchName, key) => {
  console.log(`creating new branch: ${branchName} with Initial Commit...`);
  await exec(`git checkout -b ${branchName}`); // checkout to new local branch
  await exec(
    `git commit -m "Create Branch and PR for Jira Issue: ${key}" --allow-empty`
  ); // make a commit so the PR can be created
  await exec(`git push --set-upstream origin ${branchName}`); // push this branch to remote
};

const createPr = async (key, summary, url, branch) => {
  const title = `${key} ${summary}`;
  const body = url;
  console.log(`Creating Pull Request: ${title}`);
  const { stdout } = await exec(
    `gh pr create --title "${title}" --body "${body}" --assignee @me --head ${branch} `
  );

  return stdout;
};

module.exports = {
  branchify,
  onCleanBranch,
  isEmpty,
  checkoutNewBranch,
  createPr,
  pullDefault,
};
