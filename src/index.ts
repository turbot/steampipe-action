import { setFailed } from "@actions/core";
import { debug, info } from "console";
import { processAnnotations } from "./annotate";
import { ActionInput } from "./input";
import { runSteampipeCheck } from "./run-checks";
import { cloneMod } from "./setup-mod";
import * as utils from "./utils";

async function run() {
  try {
    const inputs = new ActionInput()
    await inputs.validate()

    // install the mod right away
    // if this fails for some reason, we cannot continue
    const modPath = await cloneMod(inputs.modRepository)

    // Checks if steampipe is installed
    const steampipePath = utils.checkCacheForSteampipeVersion(inputs.version)
    if (!steampipePath) {
      throw new Error(`Unable to find Steampipe version '${inputs.version}'.`);
    }
    info(`Found ${inputs.version} in cache @ ${steampipePath}`);

    try {
      // since `steampipe check` may exit with a non-zero exit code - this is normal
      const execOutput = await runSteampipeCheck(modPath, inputs, ["json", "md"])
    }
    catch (e) {
      // throw e
    }
    finally {
      await utils.exportStepSummary(inputs)
      await processAnnotations(inputs)
    }

  } catch (error) {
    setFailed(error.message);
  }
}

run()
