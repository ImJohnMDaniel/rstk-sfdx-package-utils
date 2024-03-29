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

    // strip out the "-LATEST" string as it won't be needed in the query.
    const versionWorking = version.toUpperCase().replace('-LATEST', '').replace('.LATEST', '');

    // Split the remaining "Major.Minor.Patch.BuildNumber" version number out to its individual integers.
    const vers = versionWorking.split('.');

    // Assemble the query needed
    let query = 'Select SubscriberPackageVersionId, IsPasswordProtected, IsReleased ';
    query += 'from Package2Version ';
    query += `where Package2Id='${packageName}' and MajorVersion=${vers[0]} `;

    // If Minor Version isn't set to LATEST, look for the exact Minor Version
    if (vers[1]) {
      query += `and MinorVersion=${vers[1]} `;
    }

    // If Patch Version isn't set to LATEST, look for the exact Patch Version
    if (vers[2]) {
      query += `and PatchVersion=${vers[2]} `;
    }

    // If Build Number isn't set to LATEST, look for the exact Package Version
    if (vers[3]) {
      query += `and BuildNumber=${vers[3]} `;
    }

    // If Branch is specified, use it to filter
    if (branch) {
      query += `and Branch='${branch.trim()}' `;
    } else {
      query += 'and Branch=NULL ';
    }

    // if the query is looking for a "LATEST", "Non-pinned" version, then we need
    //  to sort the result list in such a manner to that the latest version will
    //  be the first record in the result set.
    query += 'ORDER BY MajorVersion DESC, MinorVersion DESC, PatchVersion DESC, BuildNumber DESC Limit 1';

    // console.log(`Query: ${query}`);

    // Query DevHub to get the expected Package2Version
    const conn = theDevHubOrg.getConnection();

    // tslint:disable-next-line:no-any
    const resultPackageVersionRecord = await conn.tooling.query(query) as any;
    // console.log(resultPackageVersionRecord);

    if (resultPackageVersionRecord.size === 0) {
      // Query returned no result
      const errorMessage = `Unable to find SubscriberPackageVersionId for dependent package ${name}`;
      throw new core.SfdxError(errorMessage);
    } else {
      packageId = resultPackageVersionRecord.records[0].SubscriberPackageVersionId;
    }
  }

  return packageId;
}
