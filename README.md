rstk-sfdx-package-utils
=======================

Utilities to better manage SalesforceDX Packages

# Contents
<!-- toc -->
* [Contents](#contents)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g rstk-sfdx-package-utils
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
rstk-sfdx-package-utils/0.1.2 darwin-x64 node-v11.10.1
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`sfdx rstk:package:dependencies:install [-k <string>] [-b <string>] [-w <number>] [-r] [--dryrun] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`](#sfdx-rstkpackagedependenciesinstall--k-string--b-string--w-number--r---dryrun--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfatal)

## `sfdx rstk:package:dependencies:install [-k <string>] [-b <string>] [-w <number>] [-r] [--dryrun] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]`

Install dependent Packages for a sfdx project

```
USAGE
  $ sfdx rstk:package:dependencies:install [-k <string>] [-b <string>] [-w <number>] [-r] [--dryrun] [-v <string>] [-u 
  <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal]

OPTIONS
  -b, --branch=branch                              For dependencies specified by package/versionNumber combination, you
                                                   can specify the branch group of builds to work from by entering the
                                                   branch build name.  If not specified, the builds from NULL branch
                                                   will be considered.

  -k, --installationkeys=installationkeys          Installation key for key-protected packages (format is
                                                   1:MyPackage1Key 2: 3:MyPackage3Key... to allow some packages without
                                                   installation key)

  -r, --noprompt                                   Allow Remote Site Settings and Content Security Policy websites to
                                                   send or receive data without confirmation

  -u, --targetusername=targetusername              username or alias for the target org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org

  -w, --wait=wait                                  Number of minutes to wait for installation status (also used for
                                                   publishwait). Default is 10

  --apiversion=apiversion                          override the api version used for api requests made by this command

  --dryrun                                         Allows the command to execute and display result information without
                                                   actually performing the package installations.  Useful if debugging.

  --json                                           format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)   [default: warn] logging level for this command invocation

EXAMPLE
  $ rstk:package:dependencies:install -u MyScratchOrg -v MyDevHub -k "1:MyPackage1Key 2: 3:MyPackage3Key" -b "DEV"
```

_See code: [src/commands/rstk/package/dependencies/install.ts](https://github.com/RootstockMFG/rstk-sfdx-package-utils/blob/v0.1.2/src/commands/rstk/package/dependencies/install.ts)_
<!-- commandsstop -->
