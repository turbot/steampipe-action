import { addPath, setFailed } from "@actions/core";
import { ActionInput } from "./input";
import { setupPlugins } from "./setup-plugins";
import { setupSteampipe } from "./setup-steampipe";

async function run() {
  try {
    const inputs = new ActionInput()
    inputs.validate()

    const steampipePath = await setupSteampipe(inputs.version)
    await setupPlugins(steampipePath, inputs)

    // add the path to the Steampipe CLI so that it can be used by subsequent steps if required
    addPath(steampipePath)

  } catch (error) {
    setFailed(error.message);
  }
}

run()