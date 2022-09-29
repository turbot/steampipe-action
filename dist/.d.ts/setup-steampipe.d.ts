/**
 *
 * Downloads and extracts the given steampipe version from the official steampipe releases in turbot/steampipe repository
 * Attempts to cache the downloaded binary by platform and architecture.
 * Installs steampipe by setting up the embedded postgres database.
 *
 * Note: when using the `latest` release, it is NEVER cached. This is because, `latest` is a pointer to an actual version which keeps changing as new releases are pushed out.
 *
 * @param version The version of steampipe to download. Default: `latest`
 */
export declare const setupSteampipe: (version: string) => Promise<string>;
export declare function getSteampipeVersions(): Promise<any[]>;
