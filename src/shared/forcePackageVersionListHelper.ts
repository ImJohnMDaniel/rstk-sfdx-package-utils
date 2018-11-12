import { spawn } from 'child-process-promise';
import * as _ from 'lodash';
import { PackageVersion } from '../types/package_version';

export async function findAll() {
    // Get the package version list from the DevHub
    // const packageVersionList = await core.
    this.ux.log('Retrieveing package version list');
    const args = [];
    args.push('force:package:version:list');
    args.push('--verbose');
    args.push('--json');

//        const packageVersionList = await spawn('sfdx', args, { stdio: 'inherit' }) as AnyJson;

    // let aPackageVersionListResult;
    let scratchJson;
    await spawn('sfdx', args, { capture: [ 'stdout', 'stderr' ]})
    .then(response => {
        // console.log('[spawn] stdout: ', response.stdout.toString());
        // aPackageVersionListResult = response.stdout.toString() as PackageVersionListResult;
        // aPackageVersionListResult = response.stdout as PackageVersionListResult;
        // scratchJson = response.stdout as JsonMap;
        // core.fs.writeFile('packageVersionListResult.json', response.stdout);
        scratchJson = JSON.parse(response.stdout);
    })
    .catch(err => {
        console.error('[spawn] stderr: ', err.stderr);
    });
    const packageVersionMap: Map<string, Map<string, Map<string, PackageVersion>>> = new Map<string, Map<string, Map<string, PackageVersion>>>();
    // const packageVersionMap: Map<string, PackageVersion> = new Map<string, PackageVersion>();

    _.forEach(scratchJson.result, packageVersion => {
        packageVersion = packageVersion as PackageVersion;
        // this.ux.log('packageVersion == ' + packageVersion);
        // this.ux.logJson(packageVersion);
        this.ux.log('Package2Name === ' + packageVersion.Package2Name);

        if ( packageVersionMap.get(packageVersion.Package2Name) === undefined ) {
            packageVersionMap.set(packageVersion.Package2Name, new Map<string, Map<string, PackageVersion>>() );
        }

        if ( packageVersionMap.get(packageVersion.Package2Name).get(packageVersion.Branch) === undefined ) {
            packageVersionMap.get(packageVersion.Package2Name).set(packageVersion.Branch, new Map<string, PackageVersion>() );
        }

        if ( packageVersionMap.get(packageVersion.Package2Name).get(packageVersion.Branch).get(packageVersion.Version) === undefined ) {
            packageVersionMap.get(packageVersion.Package2Name).get(packageVersion.Branch).set(packageVersion.Version, packageVersion );
        }
    });
    return packageVersionMap;
}
