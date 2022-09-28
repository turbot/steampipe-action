import { addPath, setFailed } from "@actions/core";
import { which } from "@actions/io";
import { info } from "console";
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
    info(`Found ${inputs.version} in cache @ ${await which("steampipe", false)}`);

  } catch (error) {
    setFailed(error.message);
  }
}

run()