const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

async function run() {
  const pr = github.context.payload.pull_request;
  if (!pr) {
    core.info('No pull request found.');
    return;
  }
  const branch = pr.head.ref;
  const match = branch.match(/([A-Z]+-\d+)/);
  if (!match) {
    core.info('No JIRA ticket found in branch name.');
    return;
  }
  const ticket = match[1];
  const jiraUrl = `${process.env.JIRA_BASE_URL}/rest/api/2/issue/${ticket}`;
  const response = await fetch(jiraUrl, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64'),
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    core.setFailed(`Failed to fetch JIRA ticket: ${response.statusText}`);
    return;
  }
  const data = await response.json();
  const summary = data.fields.summary;
  const description = data.fields.description || '';
  const jiraLink = `${process.env.JIRA_BASE_URL}/browse/${ticket}`;
  const newBody = `JIRA Ticket: [${ticket}](${jiraLink})\n\n**Summary:** ${summary}\n\n${description}`;

  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  await octokit.rest.pulls.update({
    ...github.context.repo,
    pull_number: pr.number,
    body: newBody
  });
  core.info('PR description updated with JIRA info.');
}

run().catch(err => core.setFailed(err.message));
