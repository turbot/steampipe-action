import { info } from "@actions/core";
import { extractTar, extractZip } from "@actions/tool-cache";
import { arch, platform } from "process";
import { Targets } from "./targets";
import * as https from "https";
import * as semver from "semver";
import { debug } from "console";

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

export const get = async (url0, pageIdxs) => {
  function getPage(pageIdx) {
    return new Promise((resolve, reject) => {
      const url = new URL(url0)
      if (pageIdx !== null) {
        url.searchParams.append('page', pageIdx)
      }
      https.get(
        url,
        {
          headers: { 'user-agent': 'setup-steampipe' },
        },
        (res) => {
          let data = ''
          res.on('data', (chunk) => {
            data += chunk
          })
          res.on('end', () => {
            if (res.statusCode >= 400 && res.statusCode <= 599) {
              reject(
                new Error(
                  `Got ${res.statusCode} from ${url}. Exiting with error`,
                ),
              )
            } else {
              resolve(data)
            }
          })
        },
      )
        .on('error', (err) => {
          reject(err)
        })
    })
  }
  let ret
  if (pageIdxs[0] === null) {
    ret = getPage(null)
  } else {
    ret = Promise.all(pageIdxs.map((pageIdx) => getPage(pageIdx)))
  }
  return ret
}

export const getVersionFromSpec = (versionSpec, versions) => {
  let version = '';
  versions.sort((a, b) => {
    if (semver.gt(a, b)) {
      return 1;
    }
    return -1;
  });

  if (versionSpec === 'latest') {
    debug('Get latest version');
    const filtered = versions.filter((version) => {
      return !semver.prerelease(version);
    });
    return filtered[filtered.length - 1];
  }

  for (let i = versions.length - 1; i >= 0; i--) {
    const potential = versions[i];
    const satisfied = semver.satisfies(potential, versionSpec);
    if (satisfied) {
      version = potential;
      break;
    }
  }

  if (version) {
    debug(`matched: ${version}`);
  } else {
    debug('match not found');
  }

  return version;
}