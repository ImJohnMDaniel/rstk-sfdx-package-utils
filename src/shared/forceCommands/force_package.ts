import { UX } from '@salesforce/command';
import { Org } from '@salesforce/core';
import child_process = require('child_process');
import * as _ from 'lodash';
import util = require('util');
import { PackageVersions } from '../../types/package_version';

const exec = util.promisify(child_process.exec);

export async function retrievePackagesCurrentlyInstalled( thisOrg: Org, thisUx: UX ) {

    thisUx.startSpinner('Retrieving packages currently installed in org....');

    // execute the force:package:installed:list command
    const args = [];

    // base command
    args.push('sfdx');
    args.push('force:package:installed:list');

    // USERNAME argument
    args.push('--targetusername');
    args.push(`${thisOrg.getUsername()}`);

    // have the output returned as JSON
    args.push('--json');

    const installedListCallResult = await exec(args.join(' '));
    // console.log(installedListCallResult.stdout);
    // const installedPackageListJson = JSON.parse(installedListCallResult.stdout);

    return JSON.parse(installedListCallResult.stdout) as PackageVersions;

    // console.log(installedPackageListJson.result);
    // const thePackageVersionList = installedPackageListJson.result as PackageVersion[];
    // const thePackageVersionList = installedPackageListJson.result as PackageVersions;
    // console.log(thePackageVersionList[0]);

    // let priceListMap : Map<number, Product[]> = new Map<number, Product[]>();
    // const thePackageVersionBySubscriberPackageVersionIdMap = { } as PackageVersionMap; // this appears to not be PackageVersionMap but rather simply an Object { }
    // const thePackageVersionBySubscriberPackageVersionIdMap: Map<string, PackageVersion> = new Map<string, PackageVersion>();
    // const thePackageVersionBySubscriberPackageVersionIdMap = new PackageVersionMap(); // doesn't work
    // const thePackageVersionBySubscriberPackageVersionIdMap = new Map<string, PackageVersion>();

    // _.forEach(thePackageVersionList, pv => {
    //     thePackageVersionBySubscriberPackageVersionIdMap[pv.SubscriberPackageVersionId] = pv;
    // });
    // thisUx.logJson(thePackageVersionBySubscriberPackageVersionIdMap);
    // thisUx.log('_______________________________________________________________');
    // thisUx.log(`instance of a Map ? -- ${thePackageVersionBySubscriberPackageVersionIdMap instanceof Map}`);
    // console.log(thePackageVersionBySubscriberPackageVersionIdMap.get('04t0M000001Sc44QAC'));
    // console.log(thePackageVersionBySubscriberPackageVersionIdMap);
    // thisUx.log(thePackageVersionBySubscriberPackageVersionIdMap.size.toString());
    // thisUx.log(thePackageVersionBySubscriberPackageVersionIdMap.get('04t0M000001Sc44QAC').SubscriberPackageVersionId);
    // thisUx.log('checking for the package -- 04t0M000001Sc44QAC');
    // if ( thePackageVersionBySubscriberPackageVersionIdMap.has('04t0M000001Sc44QAC') ) {
    //     thisUx.log('found the package');
    // } else {
    //     thisUx.log('did not find the package');
    // }

    // const matched = results.datasets.find( item => item.name === this.flags.name || item.id === this.flags.id);
    //
    // THIS WORKS!!!!!
    // *****************************************************************************************************************************
    // const matched = thePackageVersionList.find( item => item.SubscriberPackageVersionId === '04t0M000001Sc44QAC' );
    // thisUx.log(`matched == ${matched}`); // returns an object -- probably the PAckageVersion

    // if ( matched ) {
    //     thisUx.log(`found ${matched.SubscriberPackageName} v${matched.SubscriberPackageVersionNumber}`);
    // }
    // *****************************************************************************************************************************
    // thisUx.log(thePackageVersionBySubscriberPackageVersionIdMap.keys());
    // thisUx.log('_______________________________________________________________');
    // thisUx.stopSpinner(`Found ${thePackageVersionBySubscriberPackageVersionIdMap.keys.length} packages currently installed`);

    // return thePackageVersionBySubscriberPackageVersionIdMap;
}
