import { info } from "@actions/core";
import { extractTar, extractZip } from "@actions/tool-cache";
import { arch, platform } from "process";
import { Targets } from "./targets";

export const getSteampipeDownloadLink = (version: string): URL => {
  if (version === "latest") {
    return new URL(`https://github.com/turbot/steampipe/releases/latest/download/steampipe_${Targets[platform][arch]}`);
  } else {
    return new URL(`https://github.com/turbot/steampipe/releases/download/${version}/steampipe_${Targets[platform][arch]}`);
  }
}

export const extractArchive = async (archivePath: string): Promise<string> => {
  info(`Extracting...`)
  const extractor = platform === "linux" ? extractTar : extractZip;
  return await extractor(archivePath);
}
