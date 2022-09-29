import { ExecOutput } from "@actions/exec";
import { ActionInput } from "./input";
/**
 *
 * @param cliCmd string - The path to the installed steampipe CLI.
 * @param workspaceChdir string - The path to the workspace directory where a mod (if any) is installed.
 * @param actionInputs string - The inputs that we got when this action was started.
 */
export declare function runSteampipeCheck(workspaceChdir: string, actionInputs: ActionInput, xtraExports: Array<string>): Promise<ExecOutput>;
