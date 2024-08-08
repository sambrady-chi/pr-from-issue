const branchify = (key, summary) => {
  const lowerKey = String(key).toLowerCase().split(" ").join("-");
  const lowerSummary = String(summary).toLowerCase().split(" ").join("-");

  return `${lowerKey}-${lowerSummary}`
    .replace(/[^a-z0-9-]/g, "") // removes anything that is not alphanumeric or a hyphen
    .slice(0, 50) // max length 50 characters for branch
    .trim(); // remove whitespace
};

module.exports = { branchify };
