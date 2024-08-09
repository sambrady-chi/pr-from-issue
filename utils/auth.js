// Loads variables set in .zshrc or bash_profile
// tells users if they are unset.
const getEnvVariables = () => {
  const {
    JIRA_EMAIL: email,
    JIRA_API_TOKEN: token,
    JIRA_ORG: org,
  } = process.env;

  if (!email) {
    console.log("You do not have your Jira Email configured. ");
    console.log("add the following to your .zshrc file: ");
    console.log('export JIRA_EMAIL="name@email.com"');
    console.log(" ");
  }

  if (!token) {
    console.log("You do not have your JIRA API Token Stored.");
    console.log(
      "To create a JIRA API Token, go here: https://id.atlassian.com/manage-profile/security/api-tokens"
    );
    console.log("Save the token and add it to your .zshrc file like so:");
    console.log('export JIRA_API_TOKEN="<your_token_goes_here>"');
    console.log(" ");
  }

  if (!org) {
    console.log("You do not have your Jira Org configured. ");
    console.log(
      "This should be whatever name prefixes your jira/atlassian URL."
    );
    console.log("eg. 'https://yourorg.atlassian.net'");
    console.log("add the following to your .zshrc file: ");
    console.log('export JIRA_ORG="yourorg"');
    console.log(" ");
  }

  if (email && token && org) {
    return { email, token, org };
  } else return null;
};

module.exports = {
  getEnvVariables,
};
