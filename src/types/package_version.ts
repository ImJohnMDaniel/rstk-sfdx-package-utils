import { JsonMap } from '@salesforce/ts-types';

export interface PackageVersion extends JsonMap {
    Id: string;
    SubscriberPackageId: string;
    SubscriberPackageName: string;
    SubscriberPackageNamespace: string;
    SubscriberPackageVersionId: string;
    SubscriberPackageVersionName: string;
    SubscriberPackageVersionNumber: string;
}

export interface PackageVersionMap extends Map<string, PackageVersion> { }

export interface PackageVersions {
    versions: PackageVersion[];
}
