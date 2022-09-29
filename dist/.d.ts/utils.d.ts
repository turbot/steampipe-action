import { ActionInput } from "./input";
export declare function exportStepSummary(input: ActionInput): Promise<void>;
export declare function removeFiles(files: Array<string>): Promise<void>;
export declare function getExportedJSONFiles(input: ActionInput): Promise<string[]>;
export declare function checkCacheForSteampipeVersion(version: string): string;
