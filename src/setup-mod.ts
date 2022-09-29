import { endGroup, info, startGroup } from "@actions/core";
import { exec } from "@actions/exec";
import { context } from "@actions/github";
import { which } from "@actions/io";

/**
 * Installs a mod from the given Git Clone URL.
 * Forwards the GitURL as-is to `git clone`
 * 
 * @param modRepository The HTTP/SSH url of the mod repository. This will be passed in as-is to `git clone`
 */
export async function cloneMod(modRepository: string = "") {
  if (modRepository.trim().length === 0) {
    return Promise.resolve("")
  }
  startGroup("Installing Mod")
  const clonePath = `workspace_dir_${context.runId}_${new Date().getTime()}`
  info(`Installing mod from ${modRepository}`)
  try {
    await exec(await which("git", true), ["clone", modRepository, clonePath], { silent: false })
  }
  catch (e) {
    endGroup()
    throw new Error("error while trying to clone the mod: ", e)
  }
  endGroup()
  return clonePath
}