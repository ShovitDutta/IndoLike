import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";

const owner = "Shovit Dutta";
const repo = "IndoLike";
const branch = "main";
const token = "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";

if (!token) {
  console.error("GITHUB_TOKEN environment variable is not set.");
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

async function getFileSha(filePath) {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    });
    return data.sha;
  } catch (error) {
    if (error.status === 404) {
      return undefined;
    }
    console.error(`Error getting SHA for ${filePath}:`, error);
    throw error;
  }
}

async function uploadFile(filePath) {
  const content = fs.readFileSync(filePath);
  const base64Content = Buffer.from(content).toString("base64");
  const repoPath = path.relative(".", filePath).replace(/\\/g, "/");

  try {
    const sha = await getFileSha(repoPath);

    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: repoPath,
      message: `feat: Upload ${repoPath}`,
      content: base64Content,
      sha: sha,
      branch: branch,
    });
    console.log(`Successfully uploaded ${repoPath}`);
  } catch (error) {
    console.error(`Error uploading ${repoPath}:`, error);
  }
}

async function uploadDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isFile()) {
      if (fullPath === "index.mjs") {
        console.log(`Skipping script file: ${fullPath}`);
        continue;
      }
      await uploadFile(fullPath);
    } else if (entry.isDirectory()) {
      await uploadDirectory(fullPath);
    }
  }
}

uploadDirectory(".")
  .then(() => console.log("Upload process completed."))
  .catch(error => console.error("Upload process failed:", error));
