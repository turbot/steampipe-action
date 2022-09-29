import { addPath, endGroup, startGroup } from "@actions/core";
import { find } from "@actions/tool-cache";
import { info } from "console";
import { appendFile, copyFile, readdir, readFile, unlink, writeFile } from "fs/promises";
import { extname } from "path";
import { arch } from "process";
import { ActionInput } from "./input";

export async function exportStepSummary(input: ActionInput) {
  startGroup("Sending Summary")
  info("Fetching output")
  const mdFiles = await getExportedSummaryMarkdownFiles(input)
  info("Combining outputs")
  await combineFiles(mdFiles, "summary.md")
  info("Pushing to Platform")
  await copyFile("summary.md", input.summaryFile)
  removeFiles(mdFiles)
  endGroup()
}

export async function removeFiles(files: Array<string>) {
  for (let f of files) {
    await unlink(f)
  }
}

async function combineFiles(files: Array<string>, writeTo: string) {
  await writeFile(writeTo, "")
  for (let file of files) {
    const content = await readFile(file)
    await appendFile(writeTo, content)
  }
}

async function getExportedSummaryMarkdownFiles(input: ActionInput) {
  return await getExportedFileWithExtn(input, "md")
}
export async function getExportedJSONFiles(input: ActionInput) {
  return await getExportedFileWithExtn(input, "json")
}

async function getExportedFileWithExtn(input: ActionInput, extn: string) {
  let files = new Array<string>()

  const dirContents = await readdir(".", { withFileTypes: true })
  for (let d of dirContents) {
    if (!d.isFile()) {
      continue
    }

    if (extname(d.name).length < 2) {
      continue
    }

    for (let r of input.getRun()) {
      if (d.name.startsWith(r) && extname(d.name) == `.${extn}`) {
        files.push(d.name)
      }
    }
  }

  return files
}

export function checkCacheForSteampipeVersion(version: string): string {
  if (version !== "latest") {
    info(`Checking if ${version} is cached`);
    // try to find out if the cache has an entry for this.
    const toolPath = find("steampipe", version, arch);
    addPath(toolPath)
    return toolPath;
  }
  return null;
}