import { AnyJson } from '@salesforce/command/node_modules/@salesforce/ts-types';
import * as _ from 'lodash';
import { PackageVersion } from '../types/package_version';

export interface PackageVersion {
    Package2Id: string;
    Branch: string;
    Tag: string;
    MajorVersion: number;
    MinorVersion: number;
    PatchVersion: number;
    BuildNumber: number;
    Id: string;
    SubscriberPackageVersionId: string;
    Name: string;
    NamespacePrefix: string;
    Package2Name: string;
    Description: string;
    Version: string;
    IsPasswordProtected: boolean;
    IsReleased: boolean;
    CreatedDate: string;
    LastModifiedDate: string;
    InstallUrl: string;
    Alias: string;
}

export interface PackageVersionByBranchMap {
    Branch: Map<string, PackageVersion>;
}

// export interface PackageVersionSortedMap {
//     Package: Map<string, Map<string, PackageVersion>>;
//     // This is all about the various packages
// }

export class PackageVersions {
    private packageVersionMap: Map<string, Map<string, Map<string, PackageVersion>>> = new Map<string, Map<string, Map<string, PackageVersion>>>();

    // private greeting: string;
    constructor(rawjson: any) {
        // this.greeting = rawjson;
        // parse the json
        _.forEach(rawjson, packageVersion => {
            packageVersion = packageVersion as PackageVersion;
            // this.ux.log('packageVersion == ' + packageVersion);
            // this.ux.logJson(packageVersion);
            // this.ux.log('Package2Name === ' + packageVersion.Package2Name);

            if ( this.packageVersionMap.get(packageVersion.Package2Name) === undefined ) {
                this.packageVersionMap.set(packageVersion.Package2Name, new Map<string, Map<string, PackageVersion>>() );
            }

            if ( this.packageVersionMap.get(packageVersion.Package2Name).get(packageVersion.Branch) === undefined ) {
                this.packageVersionMap.get(packageVersion.Package2Name).set(packageVersion.Branch, new Map<string, PackageVersion>() );
            }

            if ( this.packageVersionMap.get(packageVersion.Package2Name).get(packageVersion.Branch).get(packageVersion.Version) === undefined ) {
                this.packageVersionMap.get(packageVersion.Package2Name).get(packageVersion.Branch).set(packageVersion.Version, packageVersion );
            }
        });
    }
    // public greet() {
    //     return "Hello, " + this.greeting;
    // }
    public getPackageById(id: string) {

    }
}
