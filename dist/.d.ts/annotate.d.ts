import { Annotation, RootResult } from "./annotate-models";
import { ActionInput } from "./input";
export declare function processAnnotations(input: ActionInput): Promise<void>;
/**
 * Returns an array of annotations for a RootResult
 *
 * @param group GroupResult The group result returned by `steampipe check`
 * @returns
 */
export declare function getAnnotations(result: RootResult): Array<Annotation>;
export declare function parseResultFile(filePath: string): Promise<RootResult>;
/**
 * Pushes the annotations to Github.
 *
 * @param annotations Array<Annotation> Pushed a set of annotations to github
 */
export declare function pushAnnotations(input: ActionInput, annotations: Array<Annotation>): Promise<void>;
