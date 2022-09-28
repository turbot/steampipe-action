import { endGroup, info, startGroup } from "@actions/core";
import { exec } from "@actions/exec";
import { cacheDir, downloadTool, find } from "@actions/tool-cache";
import { arch } from "process";
import * as utils from "./utils";

/**
 * 
 * Downloads and extracts the given steampipe version from the official steampipe releases in turbot/steampipe repository
 * Attempts to cache the downloaded binary by platform and architecture.
 * Installs steampipe by setting up the embedded postgres database.
 * 
 * Note: when using the `latest` release, it is NEVER cached. This is because, `latest` is a pointer to an actual version which keeps changing as new releases are pushed out.
 * 
 * TODO: attempt to extract the actual version of `latest` and use it.
 * 
 * @param version The version of steampipe to download. Default: `latest`
 */
export const setupSteampipe = async (version: string = "latest"): Promise<string> => {
  let steampipePath: string;
  const toolPath = checkCacheForSteampipeVersion(version);
  if (toolPath) {
    info(`Found ${version} in cache @ ${toolPath}`);
    steampipePath = `${toolPath}/steampipe`;
  } else {
    info(`Could not find ${version} in cache. Need to download.`);
    steampipePath = `${await downloadAndDeflateSteampipe(version)}/steampipe`;
  }
  await installSteampipe(steampipePath);
  return steampipePath;
}

function checkCacheForSteampipeVersion(version: string): string {
  if (version !== "latest") {
    info(`Checking if ${version} is cached`);
    // try to find out if the cache has an entry for this.
    const toolPath = find("steampipe", version, arch);
    return toolPath;
  }
  return null;
}

async function downloadAndDeflateSteampipe(version: string = "latest") {
  startGroup("Download Steampipe");
  const downloadLink = utils.getSteampipeDownloadLink(version);
  info(`Downloading ${version}...`);
  const downloadedArchive = await downloadTool(downloadLink.toString());
  info(`Download complete`);

  const extractedTo = await utils.extractArchive(downloadedArchive);
  if (version == "latest") {
    info(`Skipping cache for 'latest' release.`);
    // no caching of `latest` binary
    return extractedTo;
  }
  info(`Caching ${version}`);
  return await cacheDir(extractedTo, "steampipe", version, arch);
}

async function installSteampipe(cliCmd = "steampipe") {
  startGroup("Installing Steampipe");
  await exec(cliCmd, ["query", "select 1"], { silent: true });
  endGroup();
  return;
}