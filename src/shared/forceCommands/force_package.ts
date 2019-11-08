/**
 * Copyright 2019 
 * The Danville Group dba Rootstock Software
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 * 
 * - The above copyright notice and this permission notice shall be included in 
 *      all copies or substantial portions of the Software.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 * - Neither the name of the Rootstock Software, The Danville Group, nor the names of its 
 *      contributors may be used to endorse or promote products derived from this software 
 *      without specific prior written permission.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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
