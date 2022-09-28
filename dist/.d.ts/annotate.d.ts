import { Annotation, RootResult } from "./annotate-models";
import { ActionInput } from "./input";
/**
 * Returns an array of annotations for a RootResult
 *
 * @param group GroupResult The group result returned by `steampipe check`
 * @returns
 */
export declare function getAnnotations(result: RootResult): Array<Annotation>;
/**
 * Pushes the annotations to Github.
 *
 * @param annotations Array<Annotation> Pushed a set of annotations to github
 */
export declare function pushAnnotations(input: ActionInput, annotations: Array<Annotation>): Promise<void>;
export declare function parseResultFile(filePath: string): Promise<RootResult>;
