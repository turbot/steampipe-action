import { ActionInput } from "./input";
/**
 * Installs the terraform steampipe plugins
 *
 * @param steampipePath THe path to the steampipe binary.
 * @param inputs The input data for the mod.
 * @returns
 */
export declare const setupPlugins: (steampipePath: string, inputs: ActionInput) => Promise<void>;
