import { getInput } from "@actions/core";

export class ActionInput {
  modRepository: string;
  plugin: string;
  scanDirectory: string;
  version: string;

  constructor() {
    this.modRepository = getInput("mod", { required: true });
    this.plugin = getInput("plugin", { required: true });
    this.scanDirectory = getInput("directory");
    this.version = getInput("version") || 'latest';
  }

  validate() {
    if (this.modRepository.trim().length == 0) {
      throw new Error("A mod repository is required to run this action. Head over to https://hub.steampipe.io/mods?q=terraform for mods you can run with this action.")
    }
    if (this.plugin.trim().length == 0) {
      throw new Error("A plugin is required to run this action. Head over to https://hub.steampipe.io/plugins for plugin.")
    }
  }
}
