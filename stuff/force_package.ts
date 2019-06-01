import { UX } from '@salesforce/command';
import { Org } from '@salesforce/core';
// import child_process = require('child_process');
import child_process_promise = require('child-process-promise');
import * as _ from 'lodash';
// import { PackageVersionCreateCommand } from 'salesforce-alm/dist/commands/force/package/version/create';
// import { PackageInstalledListCommand } from 'salesforce-alm/dist/commands/force/package/installed/list';
// import util = require('util');
import { PackageVersion } from '../../types/package_version';
const spawn = child_process_promise.spawn;

// const exec = util.promisify(child_process.exec);
// const spawn = child_process.spawn;

export async function retrievePackagesCurrentlyInstalled( thisOrg: Org, thisUx: UX ) {

    thisUx.startSpinner('Retrieving packages currently installed in org....');

    // execute the force:package:installed:list command
    const args = [];

    // base command
    // args.push('sfdx');
    args.push('force:package:installed:list');

    // USERNAME argument
    args.push('--targetusername');
    args.push(`${thisOrg.getUsername()}`);

    // have the output returned as JSON
    args.push('--json');

    // const installedListCallResult = await exec(args.join(' '));

    const stdioValue = 'inherit'; // this will show the output from the install command but does not appear to be captured to the stdout
          // const stdioValue = 'pipe'; // this stdio value appears to work

    console.log('before the await spawn event');
    // const installedListCallChildProcess = spawn('sfdx', args, { stdio: stdioValue});
    const installedListCallChildProcess = spawn('sfdx', args);

    console.log('after the await spawn event');

//    console.log(installedListCallChildProcess);

    // console.log('before promise await______________________________________________________________________________');
    // await installedListCallChildProcess;
    // console.log('after promise await______________________________________________________________________________');

//    console.log(installedListCallChildProcess);

    installedListCallChildProcess.on('error', err => {
      console.log('Failed to start installedListCallChildProcess.');
      // console.log(err);
    });

    let installedPackageListJson = { };

    installedListCallChildProcess.stdout.on('data', data => {
      console.log(`installedListCallChildProcess stdout: ${data}`);
      installedPackageListJson = JSON.parse(data);
      // console.log(data);
    });

    installedListCallChildProcess.stderr.on('data', data => {
      console.log(`installedListCallChildProcess stderr: ${data}`);
      // console.log(data);
    });

    installedListCallChildProcess.on('close', code => {
        console.log(`installedListCallChildProcess process exited with code ${code}`);
        thisUx.logJson(installedPackageListJson);
    });

    // this.exit();
    // console.log(args);

    // console.log('before promise await______________________________________________________________________________');
    // await installedListCallChildProcess;
    // console.log('after promise await______________________________________________________________________________');

    // console.log(PackageInstalledListCommand.run(args));

    // const installedListCallResult =  await PackageInstalledListCommand.run(args);
    // const installedListCallPromise =  PackageInstalledListCommand.run(args);
    // installedListCallPromise.then(onfulfilled => {
    //     console.log('inside the promise then for onfulfilled');
    //     console.log(onfulfilled); // "Stuff worked!"
    //   },
    //   onrejected => {
    //     console.log('inside the promise then for rejected');
    //     console.log(onrejected);
    //   }
    // );
    // console.log('after the promise then');
    // console.log('before promise await');
    // await installedListCallPromise;
    // console.log('after promise await');
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
//    console.log(installedListCallPromise);
//    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log(installedListCallResult.stdout);
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // const installedPackageListJson = JSON.parse(installedListCallResult.stdout);

    thisUx.stopSpinner();

    // return JSON.parse(installedListCallResult.stdout).result as PackageVersions;
//    return JSON.parse(installedListCallResult.stdout).result as PackageVersion[];

    return {} as PackageVersion[];

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

async function 