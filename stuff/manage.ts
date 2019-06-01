import {core, flags, SfdxCommand} from '@salesforce/command';
import cli from 'cli-ux';
// import * as inquirer from 'inquirer';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('rstk-sfdx-package-utils', 'rstk-package-dependencies-manage');

export default class Manage extends SfdxCommand {
    public static description = messages.getMessage('commandDescription');

    public static examples = [messages.getMessage('examplesDescription')];

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

    public async run(): Promise<any> { // tslint:disable-line:no-any

        // this.ux.startSpinner( messages.getMessage('commandSpinner') );
        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        // const conn = this.org.getConnection();

        // Getting Project config
        // const project = await core.SfdxProjectJson.retrieve<core.SfdxProjectJson>();

        // Getting a list of alias
        // const packageAliases = project.get('packageAliases') || {};

        // Getting a list of package directories
        // const packageDirectories = project.get('packageDirectories') as core.JsonArray || [];

        // core.Project

        await cli.prompt('What is your name?');

        // mask input after enter is pressed
        await cli.prompt('What is your two-factor token?', {type: 'mask'});

        // mask input on keypress (before enter is pressed)
        await cli.prompt('What is your password?', {type: 'hide'});

        // const {flags} = this.parse(MyCommand)
        // let stage = flags.stage
        // if (!stage) {
        let responses: Promise<any> = await inquirer.prompt([{
            name: 'stage',
            message: 'select a stage',
            type: 'list',
            choices: [{name: 'development'}, {name: 'staging'}, {name: 'production'}],
            pageSize: 3
          }]);
        // stage = responses.stage;
        // }
        // this.log(`the stage is: ${stage}`)
        this.log(`the stage is: ${responses.stage}`);

        let packageVersionSelectionResponses: any = await inquirer.prompt([{
            name: 'version',
            message: 'which released version of apex-mocks should be used',
            type: 'list',
            choices: [{name: '1.0.0.0'}, {name: '1.1.0.5'}, {name: '1.2.0.7'}, {name: '1.3.0.1'}, {name: '1.4.1.2'}, {name: '1.5.0.3'}, {name: '1.6.0.1'}],
            pageSize: 3
          }]);

        this.log(`apex-mocks version selected: ${packageVersionSelectionResponses.version}`);

        // yes/no confirmation
        await cli.confirm('Continue?');

        // "press any key to continue"
        // await cli.anykey();

        // this.ux.log('The scratch org is now activated for Rootstock.');
        // this.ux.stopSpinner();

        // this.ux.log( messages.getMessage('commandSuccess', [this.org.getOrgId()]) );

        return;
    }
}
