import {core, flags, SfdxCommand} from '@salesforce/command';
// import { fs } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
// import { exec } from 'child-process-promise';
import { spawn } from 'child-process-promise';
import * as _ from 'lodash';
import { PackageVersion } from '../../../../types/package_version';
// import { PackageVersionListResult } from '../../../../types/package_version_list_result';
// import { writeFile } from 'fs';
// import cli from 'cli-ux';
// import * as inquirer from 'inquirer';

// const spawn = require('child-process-promise').spawn;

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('rstk-sfdx-package-utils', 'rstk-package-dependencies-manage');

export default class Manage extends SfdxCommand {
    public static description = messages.getMessage('commandDescription');

    public static examples = [
        `$ sfdx rstk:package:dependencies:manage --targetusername myOrg@example.com --targetdevhubusername devhub@org.com --branch featureBranchForPackageVersion
        `
    ];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        branch: flags.string({char: 'b', description: messages.getMessage('branchFlagDescription')})
    };

    // Comment this out if your command does not require an org username
    // protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    // private static stages = {
    //     stage: flags.string({options: ['development', 'staging', 'production']})
    // };

    public async run(): Promise<AnyJson> {

//        this.ux.startSpinner( messages.getMessage('commandSpinner') );

        // Did the user specify a branch build?
//        const branchName = this.flags.name || null;
//        const isBranchBuild = branchName != null;

        // this.hubOrg is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const hubOrgConn = this.hubOrg.getConnection();
        this.ux.log(hubOrgConn.getUsername());

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

        // this.ux.log('trying to read the json file');
        // scratchJson = await core.fs.readJson('packageVersionListResult.json');

        // const response = await exec(command);
        // this.ux.logJson(JSON.parse(response.stdout));

        // this.ux.log( 'aPackageVersionListResult === ' + aPackageVersionListResult );
        // this.ux.log('\n');
        // this.ux.log( 'aPackageVersionListResult.result === ' + aPackageVersionListResult.result );
        this.ux.log('\n');
        // this.ux.log('scratchJson === ' + scratchJson);
        // this.ux.log('scratchJson.result === ' + scratchJson.result);
        // this.ux.log('\n');
        //
        // Package2Name -> Branch -> Version (M.m.P.B) -> PackageVersion
        //
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

        this.ux.log('size == ' + packageVersionMap.size);
        this.ux.log('rstk-sfdx-ref-apex-mocks size == ' + packageVersionMap.get('rstk-sfdx-ref-apex-mocks').size);
        this.ux.log('rstk-sfdx-ref-force-di size == ' + packageVersionMap.get('rstk-sfdx-ref-force-di').size);
        this.ux.log('rstk-sfdx-ref-force-di sfdx-ref size == ' + packageVersionMap.get('rstk-sfdx-ref-force-di').get('sfdx-ref').size);

        // const packageVersions = packageVersionList.get('result') as JsonArray;
//         const packageVersionsResultList = aPackageVersionListResult.result;

//         for (const packageVersion of packageVersionsResultList) {
//             // packageVersion = packageVersion as PackageVersion;
//             this.ux.log( packageVersion );
//         }

//         // Getting Project config
//         const project = await core.SfdxProjectJson.retrieve<core.SfdxProjectJson>();

//         // Getting a list of alias
// //        const packageAliases = project.get('packageAliases') || {};

//         // Getting a list of package directories
//         const packageDirectories = project.get('packageDirectories') as JsonArray || [];

//         // loop through the packageDirectories to get at the packageDependencies
//         for (let packageDirectory of packageDirectories) {
//             packageDirectory = packageDirectory as JsonMap;
//             // this.ux.logJson(packageDirectory);
//             // let { package: dependencies } = packageDirectory;
//             const dependencies = packageDirectory.dependencies || [];

//             if (dependencies && dependencies[0] !== undefined) {

//             }
        // }

        // core.Project

//        await cli.prompt('What is your name?');

        // mask input after enter is pressed
//        await cli.prompt('What is your two-factor token?', {type: 'mask'});

        // mask input on keypress (before enter is pressed)
//        await cli.prompt('What is your password?', {type: 'hide'});

        // const {flags} = this.parse(MyCommand)
        // let stage = flags.stage
        // if (!stage) {

        // const responses: any = await inquirer.prompt([{
        //     name: 'stage',
        //     message: 'select a stage',
        //     type: 'list',
        //     choices: [{name: 'development'}, {name: 'staging'}, {name: 'production'}],
        //     pageSize: 3
        //   }]);

        // stage = responses.stage;
        // }
        // this.log(`the stage is: ${stage}`)

//        this.log(`the stage is: ${responses.stage}`);

        // const packageVersionSelectionResponses: any = await inquirer.prompt([{
        //     name: 'version',
        //     message: 'which released version of apex-mocks should be used',
        //     type: 'list',
        //     choices: [{name: '1.0.0.0'}, {name: '1.1.0.5'}, {name: '1.2.0.7'}, {name: '1.3.0.1'}, {name: '1.4.1.2'}, {name: '1.5.0.3'}, {name: '1.6.0.1'}],
        //     pageSize: 3
        //   }]);

        // this.log(`apex-mocks version selected: ${packageVersionSelectionResponses.version}`);

        // // yes/no confirmation
        // await cli.confirm('Continue?');

        // "press any key to continue"
        // await cli.anykey();

        // this.ux.log('The scratch org is now activated for Rootstock.');
        // this.ux.stopSpinner();

        // this.ux.log( messages.getMessage('commandSuccess', [this.org.getOrgId()]) );

        return;
    }
}
