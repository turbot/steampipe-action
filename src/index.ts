import { addPath, endGroup, setFailed, startGroup } from "@actions/core";
import { context } from "@actions/github";
import { which } from "@actions/io";
import { find } from "@actions/tool-cache";
import { info } from "console";
import { appendFile, copyFile, readdir, readFile, unlink, writeFile } from "fs/promises";
import { extname } from "path";
import { arch } from "process";
import { getAnnotations, parseResultFile, pushAnnotations } from "./annotate";
import { Annotation } from "./annotate-models";
import { ActionInput } from "./input";
import { cloneMod } from "./setup-mod";
import { runSteampipeCheck } from "./steampipe";

async function run() {
  try {
    const inputs = new ActionInput()
    await inputs.validate()

    // install the mod right away
    // if this fails for some reason, we cannot continue
    const modPath = await cloneMod(inputs.modRepository)

    const steampipePath = checkCacheForSteampipeVersion(inputs.version)
    if (!steampipePath) {
      throw new Error(`Unable to find Steampipe version '${inputs.version}'.`);
    }
    info(`Found ${inputs.version} in cache @ ${steampipePath}`);

    try {
      // since `steampipe check` may exit with a non-zero exit code - this is normal
      const execOutput = await runSteampipeCheck(modPath, inputs, ["json", "md"])
      info('---------------------------', execOutput);
    }
    catch (e) {
      // throw e
    }
    finally {
      await exportStepSummary(inputs)
      await exportAnnotations(inputs)
    }

  } catch (error) {
    setFailed(error.message);
  }
}

function checkCacheForSteampipeVersion(version: string): string {
  if (version !== "latest") {
    info(`Checking if ${version} is cached`);
    // try to find out if the cache has an entry for this.
    const toolPath = find("steampipe", version, arch);
    addPath(toolPath)
    return toolPath;
  }
  return null;
}

async function exportAnnotations(input: ActionInput) {
  if (context.payload.pull_request == null) {
    return
  }
  startGroup("Processing output")
  info("Fetching output")
  const jsonFiles = await getExportedJSONFiles(input)
  const annotations: Array<Annotation> = []
  for (let j of jsonFiles) {
    const result = await parseResultFile(j)
    annotations.push(...getAnnotations(result))
  }
  info(`Pushing Annotations`)
  await pushAnnotations(input, annotations)
  removeFiles(jsonFiles)
  endGroup()
}

async function exportStepSummary(input: ActionInput) {
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

async function removeFiles(files: Array<string>) {
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
async function getExportedJSONFiles(input: ActionInput) {
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

run()
