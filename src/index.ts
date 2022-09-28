import { addPath, setFailed, setOutput } from "@actions/core";
import { ActionInput } from "./input";
import { cloneMod } from "./setup-mod";
import { setupPlugins } from "./setup-plugins";
import { setupSteampipe } from "./setup-steampipe";

async function run() {
  try {
    const inputs = new ActionInput()
    inputs.validate()

    // install the mod right away
    // if this fails for some reason, we cannot continue
    const clonePath = await cloneMod(inputs.modRepository)
    const steampipePath = await setupSteampipe(inputs.version)
    await setupPlugins(steampipePath, inputs)

    setOutput('mod-path', clonePath);

    // add the path to the Steampipe CLI so that it can be used by subsequent steps if required
    addPath(steampipePath)

  } catch (error) {
    setFailed(error.message);
  }
}

run()