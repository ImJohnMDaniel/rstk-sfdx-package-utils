import {core, SfdxCommand} from '@salesforce/command';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('rstk-sfdx-package-utils', 'scratch');

export default class Scratch extends SfdxCommand {
    public static description = messages.getMessage('commandDescription');

    public static examples = [
        `$ sfdx rstk:scratch --targetusername myOrg@example.com --targetdevhubusername devhub@org.com
        `
    ];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)

    };

    // Comment this out if your command does not require an org username
    // protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = true;

    public async run(): Promise<core.AnyJson> {

        this.ux.startSpinner( messages.getMessage('commandSpinner') );
        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();

        // if ( ! await orgValidator.isScratchOrg( this.org, conn ) ) {
        //     // this command can only be run on a DX scratch org (which shows as a sandbox)
        //     throw new core.SfdxError(messages.getMessage('errorExecutionNotAllowed', [this.org.getOrgId()]));
        // }

        // Setup the default scratch org user in the SYUSR SObject
        // try {
        //     await syUserService.setupDXScratchOrgDefaultUser( conn );
        // } catch (e) {
        //     // the default scratch user is already setup in this org.  Do nothing.
        //     this.logger.debug('The default scratch user is already setup in this org.');
        // }

        // Setup the "Automated Process" user used by platform events in the SYUSR SObject
        // try {
        //     await syUserService.setupAutomatedProcessUser( conn );
        // } catch (e) {
        //     // the automated process user is already setup in this org.  Do nothing.
        //     this.logger.debug('The Automated Process user is already setup in this org.');
        // }

        // this.ux.log('The scratch org is now activated for Rootstock.');
        this.ux.stopSpinner();

        // this.ux.log( messages.getMessage('commandSuccess', [this.org.getOrgId()]) );

        return;
    }
}
