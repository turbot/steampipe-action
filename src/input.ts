import { getInput } from "@actions/core";

export class ActionInput {
  // plugin: string;
  scanDirectory: string;
  version: string;

  constructor() {
    // this.plugin = getInput("plugin", { required: true });
    this.scanDirectory = getInput("directory");
    this.version = getInput("version") || 'latest';
  }

  validate() {
    // if (this.plugin.trim().length == 0) {
    //   throw new Error("A plugin is required to run this action. Head over to https://hub.steampipe.io/plugins for plugin.")
    // }
  }
}
