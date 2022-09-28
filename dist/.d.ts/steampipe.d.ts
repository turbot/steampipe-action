import { ActionInput } from "./input";
/**
 * Installs a mod from the given Git Clone URL.
 * Forwards the GitURL as-is to `git clone`
 *
 * @param modRepository The HTTP/SSH url of the mod repository. This will be passed in as-is to `git clone`
 */
export declare function installMod(modRepository?: string): Promise<string>;
/**
 *
 * @param cliCmd string - The path to the installed steampipe CLI.
 * @param workspaceChdir string - The path to the workspace directory where a mod (if any) is installed.
 * @param actionInputs string - The inputs that we got when this action was started.
 */
export declare function runSteampipeCheck(cliCmd: string, workspaceChdir: string, actionInputs: ActionInput, xtraExports: Array<string>): Promise<void>;
