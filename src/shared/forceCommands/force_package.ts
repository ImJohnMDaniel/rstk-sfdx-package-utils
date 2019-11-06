import { UX } from '@salesforce/command';
import { Org } from '@salesforce/core';
import * as _ from 'lodash';
import { PackageInstalledListCommand } from 'salesforce-alm/dist/commands/force/package/installed/list';
import { PackageVersion } from '../../types/package_version';

export async function retrievePackagesCurrentlyInstalled( thisOrg: Org, thisUx: UX ) {

    thisUx.startSpinner('Retrieving packages currently installed in org....');

    // execute the force:package:installed:list command
    const args = [];

    // USERNAME argument
    args.push('--targetusername');
    args.push(`${thisOrg.getUsername()}`);

    // have the output returned as JSON
    args.push('--json');

    // up the log level
    args.push('--loglevel');
    args.push('debug');

    const intercept = require('intercept-stdout');

    // const logs = [];

    // tslint:disable-next-line: only-arrow-functions
    const unhookIntercept = intercept(function(text) {
        // logs.push(text);
        return '';
    });

    let installedPackageListJson = await PackageInstalledListCommand.run( args );

    if ( installedPackageListJson === undefined || installedPackageListJson.status !== 0 ) {
        installedPackageListJson = await PackageInstalledListCommand.run( args );
    }

    // Stop capturing stdout.
    unhookIntercept();

    // thisUx.log('log');
    // thisUx.log(installedPackageListJson);
    // thisUx.error('error');
    // thisUx.error(installedPackageListJson);

    // if ( installedPackageListJson.status != 0 ) {
    //     throw Error('problems retrieving installed package list' + installedPackageListJson);
    // }

    thisUx.stopSpinner();

//    thisUx.logJson(installedPackageListJson);
    return installedPackageListJson as PackageVersion[];
}
