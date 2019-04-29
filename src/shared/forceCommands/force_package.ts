import { UX } from '@salesforce/command';
import { Org } from '@salesforce/core';
import * as _ from 'lodash';
import { PackageVersion } from '../../types/package_version';
// tslint:disable-next-line:no-var-requires
const {onExit, chunksToLinesAsync, chomp} = require('@rauschma/stringio');
// tslint:disable-next-line:no-var-requires
const {spawn} = require('child_process');

// tslint:disable-next-line:no-var-requires
// const spawn = require('child-process-promise').spawn;

async function echoReadable(readable) {
    let commandJSONOutput = '';
    for await (const line of chunksToLinesAsync(readable)) {
      // console.log('LINE: ' + chomp(line) );
      commandJSONOutput = commandJSONOutput + chomp(line).trim();
    }
    console.log(commandJSONOutput);
    return JSON.parse(commandJSONOutput);
  }

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

    // const stdioValue = 'inherit'; // this will show the output from the install command but does not appear to be captured to the stdout
    // const stdioValue = 'pipe'; // this stdio value appears to work
    const stdioValue = ['ignore', 'pipe', process.stderr]; // this goes with the echoReadable option
    // const stdioValue = [process.stdin, process.stdout, process.stderr];

    // const promise = await spawn('sfdx', args, { stdio: stdioValue});
    const childProcess = spawn('sfdx', args, { stdio: stdioValue});

    // const source = spawn('cat', [filePath],
    // {stdio: ['ignore', 'pipe', process.stderr]});
    const installedPackageListJson = await echoReadable(childProcess.stdout);

    console.log( installedPackageListJson );

    if ( installedPackageListJson.status !== 0 ) {
        throw Error('problems retrieving installed package list' + installedPackageListJson);
    }

    // await onExit(childProcess);
    // childProcess.stdout.on('data', data => {
    //   console.log(`installedListCallChildProcess stdout: ${data}`);
    //   // installedPackageListJson = JSON.parse(data);
    //   // console.log(data);
    // });

    // console.log(process.stdout);
    // installedPackageListJson = JSON.parse(process.stdout);

    // const installedListCallChildProcess = promise.childProcess;

    // console.log('[spawn] installedListCallChildProcess.pid: ', installedListCallChildProcess.pid);
    // console.log('[spawn] installedListCallChildProcess.stdout: ', installedListCallChildProcess.stdout);

    // let installedPackageListJson = { };
    // console.log('before installedListCallChildProcess.stdout.on(data');
    // installedListCallChildProcess.stdout.on('data', data => {
    //   console.log(`installedListCallChildProcess stdout: ${data}`);
    //   installedPackageListJson = JSON.parse(data);
    //   // console.log(data);
    // });
    // console.log('before installedListCallChildProcess.stderr.on(data');
    // installedListCallChildProcess.stderr.on('data', data => {
    //   console.log(`installedListCallChildProcess stderr: ${data}`);
    //   // console.log(data);
    // });

    // promise.then(() => {
    //     console.log('[spawn] done!');
    //     console.log(' ');
    //     console.log(' ');
    //     console.log('________________________________________________________________________________');
    //     console.log(' ');
    //     console.log(promise);
    //     console.log(' ');
    //     console.log('________________________________________________________________________________');
    // })
    // .catch(err => {
    //     console.error('[spawn] ERROR: ', err);
    //     this.exit();
    // });

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
    // this.exit();

    return installedPackageListJson.result as PackageVersion[];

    // return JSON.parse(installedListCallResult.stdout).result as PackageVersions;
//    return JSON.parse(installedListCallResult.stdout).result as PackageVersion[];

    // return {} as PackageVersion[];

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
