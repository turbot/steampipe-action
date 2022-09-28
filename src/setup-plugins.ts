import { debug, endGroup, info, startGroup } from "@actions/core";
import { exec } from "@actions/exec";
import { context } from "@actions/github";
import { readdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { env } from "process";
import { ActionInput } from "./input";

/**
 * Installs the terraform steampipe plugins
 * 
 * @param steampipePath THe path to the steampipe binary.
 * @param inputs The input data for the mod.
 * @returns 
 */
export const setupPlugins = async (steampipePath: string, inputs: ActionInput) => {
  await installTerraformPlugin(steampipePath)
  try {
    await writeConnections(inputs)
  }
  catch (e) {
    throw new Error("error trying to create connection", e)
  }
}

async function installTerraformPlugin(cliCmd = "steampipe") {
  startGroup("Installing plugins")
  info(`Installing 'terraform@latest'`)
  await exec(cliCmd, ["plugin", "install", "terraform"], { silent: true })
  info(`Installation complete`)
  endGroup()
}

async function writeConnections(input: ActionInput) {
  startGroup("Writing Connection Data")

  const configDir = `${env["HOME"]}/.steampipe/config`
  debug("Cleaning up old config directory")

  // clean up the config directory
  // this will take care of any default configs done during plugin installation
  // and also configs which were created in steps above this step which uses this action.
  cleanConnectionConfigDir(configDir)

  const configFileName = `config_${context.runId}.spc`
  info("Writing connection data")
  await writeFile(`${configDir}/${configFileName}`,
    `connection "tf_connection_${context.runId}" {
      plugin = "terraform"
      paths = ["${input.scanDirectory}/**/*.tf"]
    }`)
  info("Finished writing connection data")
  endGroup()
}

async function cleanConnectionConfigDir(configDir: string) {
  const files = await readdir(configDir)
  for (const file of files) {
    await unlink(join(configDir, file))
  }
}