import { core } from '@salesforce/command';
import { Org } from '@salesforce/core';
import { Constants } from './constants';

export function resolveDevHubOrgInstance(thisOrg: Org): Org {
  if (!thisOrg) {
    throw new core.SfdxError('Method Parameter Exception: the following parameters must be supplied for resolveDevHubOrgInstance() -- thisOrg');
  }

  let theDevHubOrg: Org;
  if (thisOrg.isDevHubOrg()) {
    theDevHubOrg = thisOrg;
  } else if (thisOrg.getDevHubOrg()) {
    thisOrg.getDevHubOrg()
      .then(res => {
        theDevHubOrg = res;
      });
  }
  return theDevHubOrg;
}

export async function resolvePackageVersionId(name: string, version: string, branch: string, thisOrg: Org) {

  const packageName: string = name;
  // clean up the version string
  if (version) {
    // the version value could be presented wrapped in double quotes.  Those need to be removed.
    version = version.replace('"', '').replace('"', '');
  }

  if (!name || !thisOrg || !name.trim()) { // !version || !version.trim()
    const parameters: string[] = [];

    if (!name || !name.trim()) {
      parameters.push('name');
    }

    if ( packageName.startsWith(Constants.PACKAGE_ID_PREFIX) && (!version || !version.trim())) {
      parameters.push('version');
    }

    if (!thisOrg) {
      parameters.push('thisOrg');
    }

    throw new core.SfdxError('Method Parameter Exception: the following parameters must be supplied for resolvePackageVersionId() -- ' + parameters.join());
  }

  // Determine if the org supplied is the DevHub or an org that is
  const theDevHubOrg = resolveDevHubOrgInstance(thisOrg);

  //    let packageId = messages.getMessage('invalidPackageName');
  let packageId: string;

  // Keeping original name so that it can be used in error message if needed
  // let packageName = name;

  // // TODO: Some stuff are duplicated here, some code don't need to be executed for every package
  // // First look if it's an alias
  // if (typeof packageAliasesMap[packageName] !== 'undefined') {
  //   packageName = packageAliasesMap[packageName];
  // }
  // console.log(`packageName: ${packageName}`);
  // console.log(`version: ${version}`);

  if (packageName.startsWith(Constants.PACKAGE_VERSION_ID_PREFIX)) {
    // Package2VersionId is set directly
    packageId = packageName;
  } else if (packageName.startsWith(Constants.PACKAGE_ID_PREFIX)) {
    // Get Package version id from package + versionNumber
    const vers = version.split('.');
    let query = 'Select SubscriberPackageVersionId, IsPasswordProtected, IsReleased ';
    query += 'from Package2Version ';
    query += `where Package2Id='${packageName}' and MajorVersion=${vers[0]} `;

    // If Minor Version isn't set to LATEST, look for the exact Minor Version
    if (vers[1] && vers[1] !== 'LATEST') {
      query += `and MinorVersion=${vers[1]} `;
    }

    // If Patch Version isn't set to LATEST, look for the exact Patch Version
    if (vers[2] && vers[2] !== 'LATEST') {
      query += `and PatchVersion=${vers[2]} `;
    }

    // If Build Number isn't set to LATEST, look for the exact Package Version
    if (vers[3] && vers[3] !== 'LATEST') {
      query += `and BuildNumber=${vers[3]} `;
    }

    // If Branch is specified, use it to filter
    if (branch) {
      query += `and Branch='${branch.trim()}' `;
    } else {
      query += 'and Branch=NULL ';
    }

    query += 'ORDER BY BuildNumber DESC Limit 1';

    // console.log(`Query: ${query}`);

    // Query DevHub to get the expected Package2Version
    const conn = theDevHubOrg.getConnection();

    // tslint:disable-next-line:no-any
    const resultPackageId = await conn.tooling.query(query) as any;
    // console.log(resultPackageId);

    if (resultPackageId.size === 0) {
      // Query returned no result
      const errorMessage = `Unable to find SubscriberPackageVersionId for dependent package ${name}`;
      throw new core.SfdxError(errorMessage);
    } else {
      packageId = resultPackageId.records[0].SubscriberPackageVersionId;
    }
  }

  return packageId;
}
