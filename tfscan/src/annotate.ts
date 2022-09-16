import { group } from "console";
import { readFile } from "fs/promises";

export type RootResult = GroupResult
export interface GroupResult { controls: Array<ControlRun>; groups: Array<GroupResult>; }
export interface ControlRun { results: Array<ControlResult>; }
export interface ControlResult { }
export interface Annotation { }


/**
 * Returns an array of annotations for a RootResult
 * 
 * @param group GroupResult The group result returned by `steampipe check`
 * @returns 
 */
export function GetAnnotations(result: RootResult): Array<Annotation> {
  return getAnnotationsForGroup(result)
}

/**
 * 
 * @param annotations Array<Annotation> Pushed a set of annotations to github
 */
export async function PushAnnotations(annotations: Array<Annotation>) { }

export async function ParseResultFile(filePath: string): Promise<RootResult> {
  const fileContent = await readFile(filePath)
  return (JSON.parse(fileContent.toString()) as RootResult)
}

function getAnnotationsForGroup(group: GroupResult): Array<Annotation> {
  const annotations: Array<Annotation> = []
  if (group.groups) {
    for (let g of group.groups) {
      const ann = getAnnotationsForGroup(g)
      annotations.push(...ann)
    }
  }
  if (group.controls) {
    for (let c of group.controls) {
      const ann = getAnnotationsForControl(c)
      annotations.push(...ann)
    }
    return annotations
  }
}

function getAnnotationsForControl(controlRun: ControlRun): Array<Annotation> {
  controlRun.results
  return []
}
