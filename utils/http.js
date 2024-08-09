const https = require("https");

// Parses JIRA URL, searching for selectedIssue parameters or defaulting to key in JIRA URL.
// JIRA API will raise error if key is invalid.
const getJiraIssueKeyFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const { pathname, searchParams } = urlObj;
    if (searchParams.has("selectedIssue"))
      return searchParams.get("selectedIssue");

    const pathArr = pathname.split("/");
    return pathArr[pathArr.length - 1];
  } catch (e) {
    console.log("Invalid Jira Issue URL.")
    console.log(" ");
    console.log("it should look something like this: ")
    console.log("https://yourorg.atlassian.net/browse/SOME-KEY-123")
    console.log(" ");
    console.log("or this: ")
    console.log("https://yourorg.atlassian.net/jira/some/path/to/a/board/1?selectedIssue=SOME-KEY-123");
    return false;
  }
};

// tools to fetch JIRA Details from JIRA API
// uses JIRA V2 API
const fetchDataString = (url, options) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, options, (res) => {
        res.setEncoding("utf8");
        let string = "";
        res.on("data", (d) => (string += d));
        res.on("end", (_) => resolve(string)); // success, resolve promise
      })
      .on("error", (e) => reject(e)); // failure, reject promise
  });
};

const getJSON = (url, options) => {
  return fetchDataString(url, options).then((s) => JSON.parse(s));
};

const fetchIssueDetailsFromJira = ({ email, token, org, key }) => {
  const url = `https://${org}.atlassian.net/rest/api/2/issue/${key}?fields=summary`; // TODO: KEY
  const encodedAuth = Buffer.from(`${email}:${token}`).toString("base64");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Basic ${encodedAuth}`,
  };

  const options = {
    auth: encodedAuth,
    headers,
  };

  return getJSON(url, options) // return promise
    .then((data) => {
      if (!data || Object.keys(data).length == 0)
        throw Error("empty response"); // local error
      else return data; // success
    }); // no error-check
};

module.exports = {
  getJiraIssueKeyFromUrl,
  fetchIssueDetailsFromJira,
};
