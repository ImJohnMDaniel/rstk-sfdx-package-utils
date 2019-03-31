import { JsonMap } from '@salesforce/ts-types';
import { Attribute } from './attribute';

export interface PackageInstallRequest extends JsonMap {
    Id: string;
    IsDeleted: boolean;
    CreatedDate: string;
    CreatedById: string;
    LastModifiedDate: string;
    LastModifiedById: string;
    SystemModstamp: string;
    SubscriberPackageVersionKey: string;
    NameConflictResolution: string;
    SecurityType: string;
    PackageInstallSource: string;
    ProfileMappings: string;
    Password: string;
    EnableRss: boolean;
    UpgradeType: string;
    Status: string;
    Errors: string;
    attributes: Attribute;
}
