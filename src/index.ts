import { addPath, setFailed, setOutput } from "@actions/core";
import { find } from "@actions/tool-cache";
import { info } from "console";
import { arch } from "process";
import { ActionInput } from "./input";
import { setupPlugins } from "./setup-plugins";
import { getSteampipeVersions, setupSteampipe } from "./setup-steampipe";
import * as utils from "./utils";

async function run() {
  try {
    const inputs = new ActionInput()
    inputs.validate()

    const steampipeVersions = await getSteampipeVersions()
    const versionToInstall = utils.getVersionFromSpec(inputs.version, steampipeVersions);
    if (!versionToInstall) {
      throw new Error(`Unable to find Steampipe version '${inputs.version}'.`);
    }

    const steampipePath = await setupSteampipe(versionToInstall)
    await setupPlugins(steampipePath, inputs)

    setOutput('steampipe-version', versionToInstall);

    // add the path to the Steampipe CLI so that it can be used by subsequent steps if required
    addPath(steampipePath)
    info(`Found ${versionToInstall} in cache @ ${find("steampipe", versionToInstall, arch)}`);

  } catch (error) {
    setFailed(error.message);
  }
}

run()