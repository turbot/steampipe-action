import { endGroup, startGroup } from "@actions/core";
import { ExecOutput, getExecOutput } from "@actions/exec";
import { env } from "process";
import { ActionInput } from "./input";

/**
 * 
 * @param workspaceChdir string - The path to the workspace directory where a mod (if any) is installed. 
 * @param actionInputs string - The inputs that we got when this action was started.
 */
export async function runSteampipeCheck(workspaceChdir: string, actionInputs: ActionInput, xtraExports: Array<string>): Promise<ExecOutput> {
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

  env.STEAMPIPE_CHECK_DISPLAY_WIDTH = "120"

  endGroup()
  return await getExecOutput("steampipe", args, {
    env: env,
  })

}
