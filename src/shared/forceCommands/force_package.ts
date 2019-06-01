import { UX } from '@salesforce/command';
import { Org } from '@salesforce/core';
import * as _ from 'lodash';
import { PackageVersion } from '../../types/package_version';
// tslint:disable-next-line:no-var-requires
const { chunksToLinesAsync, chomp } = require('@rauschma/stringio');
// tslint:disable-next-line:no-var-requires
const {spawn} = require('child_process');

// const defaultWait = 10;

async function processStreamOutputToJSON(readable) {
    let commandJSONOutput = '';
    for await (const line of chunksToLinesAsync(readable)) {
      commandJSONOutput = commandJSONOutput + chomp(line).trim();
    }
    // console.log(commandJSONOutput);
    return JSON.parse(commandJSONOutput);
  }

// // tslint:disable-next-line:no-any
// export async function install( thisOrg: Org, thisUx: UX, thisFlags: OutputFlags<any>, packageVersionId: String ) {

//   thisUx.startSpinner('Retrieving packages currently installed in org....');

//   // Split arguments to use spawn
//   const args = [];
//   // args.push('sfdx');
//   args.push('force:package:install');

//   // USERNAME
//   args.push('--targetusername');
//   args.push(`${this.org.getUsername()}`);

//   // PACKAGE ID
//   args.push('--package');
//   args.push(`${packageInfo.packageVersionId}`);

//   // INSTALLATION KEY
//   if (installationKeys && installationKeys[i]) {
//     args.push('--installationkey');
//     args.push(`${installationKeys[i]}`);
//   }

//   // WAIT
//   const wait = thisFlags.wait ? thisFlags.wait : defaultWait;
//   args.push('--wait');
//   args.push(`${wait}`);
//   args.push('--publishwait');
//   args.push(`${wait}`);

//   // NOPROMPT
//   if (thisFlags.noprompt) {
//     args.push('--noprompt');
//   }

//   // JSON
//   if (thisFlags.json) {
//     args.push('--json');
//   }

//   thisUx.stopSpinner();
// }

export async function retrievePackagesCurrentlyInstalled( thisOrg: Org, thisUx: UX ) {

    thisUx.startSpinner('Retrieving packages currently installed in org....');

    // execute the force:package:installed:list command
    const args = [];

    // base command
    args.push('force:package:installed:list');

    // USERNAME argument
    args.push('--targetusername');
    args.push(`${thisOrg.getUsername()}`);

    // have the output returned as JSON
    args.push('--json');

    const stdioValue = ['ignore', 'pipe', process.stderr]; // this goes with the processStreamOutputToJSON option

    const childProcess = spawn('sfdx', args, { stdio: stdioValue});

    const installedPackageListJson = await processStreamOutputToJSON(childProcess.stdout);

    // console.log( installedPackageListJson );

    if ( installedPackageListJson.status !== 0 ) {
        throw Error('problems retrieving installed package list' + installedPackageListJson);
    }

    thisUx.stopSpinner();

    return installedPackageListJson.result as PackageVersion[];
}
