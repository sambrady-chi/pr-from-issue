# PR From Issue (PFI)

`pfi` is a lightweight command line tool that makes it easy to create a Git Branch and Pull Request from a Jira issue. 

###  Setup:

1. `npm install -g pr-from-issue`. it is recommended to install globally so you can use it easily across all repositories, instead of installing it inside each repo.

2. Add the following to your .zshrc or bash_profile:

```
export JIRA_ORG="yourorg" // this is the prefix of all your Jira/Atlassian URLs
export JIRA_EMAIL="yourname@mail.com" // this is the email you use to log into JIRA
export JIRA_API_TOKEN="string" // generate one here: https://id.atlassian.com/manage-profile/security/api-tokens
```

3. This tool assumes you have Git and [GitHub Cli](https://github.com/cli/cli) installed and working on your machine. Ensure that you can successfully run commands like `git checkout -b my-new-branch` and `gh list` before attempting to use this tool.

### Usage:

1. `cd` into the relevant git repository
2. `git checkout` back to your repository's default branch (likely `main` or `master`).
3. ensure you have no outstanding changes & your working tree is clean. 
4. copy the Issue Link from JIRA
5. run the `pfi` command 


### Example:

`pfi https://yourorg.atlassian.net/browse/ABC-123`

Running this command will do the following:
1. create a branch named `abc-123-title-of-issue` 
2. checkout to that branch locally 
3. create an initial commit 
4. push that commit to remote 
5. create a Pull Request for the branch. 

It should print the URL for your new Pull Request in the terminal output. 