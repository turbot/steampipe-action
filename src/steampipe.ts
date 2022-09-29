import { endGroup, info, startGroup } from "@actions/core";
import { exec } from "@actions/exec";
import { context } from "@actions/github";
import { which } from "@actions/io";
import { env } from "process";
import { ActionInput } from "./input";

/**
 * Installs a mod from the given Git Clone URL.
 * Forwards the GitURL as-is to `git clone`
 * 
 * @param modRepository The HTTP/SSH url of the mod repository. This will be passed in as-is to `git clone`
 */
export async function installMod(modRepository: string = "") {
  if (modRepository.trim().length === 0) {
    return Promise.resolve("")
  }
  startGroup("Installing Mod")
  const cloneTo = `workspace_dir_${context.runId}_${new Date().getTime()}`
  info(`Installing mod from ${modRepository}`)
  info(`Get PAth : ${await which("git", false)}`)
  try {
    await exec(await which("git", true), ["clone", modRepository, cloneTo], { silent: false })
  }
  catch (e) {
    throw new Error("error while trying to clone the mod: ", e)
  } finally {
    endGroup()
  }
  return cloneTo
}

/**
 * 
 * @param cliCmd string - The path to the installed steampipe CLI.
 * @param workspaceChdir string - The path to the workspace directory where a mod (if any) is installed. 
 * @param actionInputs string - The inputs that we got when this action was started.
 */
export async function runSteampipeCheck(cliCmd: string = "steampipe", workspaceChdir: string, actionInputs: ActionInput, xtraExports: Array<string>) {
  startGroup(`Running Check`)

  let args = new Array<string>()

  args.push(
    "check",
    ...actionInputs.getRun(),
  )

  if (actionInputs.output.length > 0) {
    args.push(`--output=${actionInputs.output}`)
  }
  if (actionInputs.export.length > 0) {
    args.push(`--export=${actionInputs.export}`)
  }

  for (let f of xtraExports) {
    // add an export for self, which we will remove later on
    args.push(`--export=${f}`)
  }

  if (actionInputs.where.length > 0) {
    args.push(`--where=${actionInputs.where}`)
  }

  if (workspaceChdir.trim().length > 0) {
    args.push(`--workspace-chdir=${workspaceChdir}`)
  }

  const execEnv = env
  execEnv.STEAMPIPE_CHECK_DISPLAY_WIDTH = "120"

  await exec("steampipe", args, {
    env: execEnv,
  })

  endGroup()
}
