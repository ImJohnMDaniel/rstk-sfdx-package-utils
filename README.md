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
$ rstk-sfdx-package-utils COMMAND
running command...
$ rstk-sfdx-package-utils (-v|--version|version)
rstk-sfdx-package-utils/0.1.0 darwin-x64 node-v8.9.4
$ rstk-sfdx-package-utils --help [COMMAND]
USAGE
  $ rstk-sfdx-package-utils COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`rstk-sfdx-package-utils rstk:package:dependencies:install`](#rstk-sfdx-package-utils-rstkpackagedependenciesinstall)
* [`rstk-sfdx-package-utils rstk:package:dependencies:manage`](#rstk-sfdx-package-utils-rstkpackagedependenciesmanage)

## `rstk-sfdx-package-utils rstk:package:dependencies:install`

Install dependent Packages for a sfdx project

```
USAGE
  $ rstk-sfdx-package-utils rstk:package:dependencies:install

OPTIONS
  -b, --branch=branch                              the package version’s branch

  -k, --installationkeys=installationkeys          installation key for key-protected packages (format is
                                                   1:MyPackage1Key 2: 3:MyPackage3Key... to allow some packages without
                                                   installation key)

  -r, --noprompt                                   allow Remote Site Settings and Content Security Policy websites to
                                                   send or receive data without confirmation

  -u, --targetusername=targetusername              username or alias for the target org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org

  -w, --wait=wait                                  number of minutes to wait for installation status (also used for
                                                   publishwait). Default is 10

  --apiversion=apiversion                          override the api version used for api requests made by this command

  --json                                           format output as json

  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLE
  $ rstk:package:dependencies:install -u MyScratchOrg -v MyDevHub -k "1:MyPackage1Key 2: 3:MyPackage3Key" -b "DEV"
```

_See code: [src/commands/rstk/package/dependencies/install.ts](https://github.com/RootstockMFG/rstk-sfdx-package-utils/blob/v0.1.0/src/commands/rstk/package/dependencies/install.ts)_

## `rstk-sfdx-package-utils rstk:package:dependencies:manage`

Manage dependent package version numbers for a sfdx project

```
USAGE
  $ rstk-sfdx-package-utils rstk:package:dependencies:manage

OPTIONS
  -b, --branch=branch                              the package version’s branch
  -v, --targetdevhubusername=targetdevhubusername  username or alias for the dev hub org; overrides default dev hub org
  --apiversion=apiversion                          override the api version used for api requests made by this command
  --json                                           format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLE
  $ sfdx rstk:package:dependencies:manage --targetusername myOrg@example.com --targetdevhubusername devhub@org.com 
  --branch featureBranchForPackageVersion
```

_See code: [src/commands/rstk/package/dependencies/manage.ts](https://github.com/RootstockMFG/rstk-sfdx-package-utils/blob/v0.1.0/src/commands/rstk/package/dependencies/manage.ts)_
<!-- commandsstop -->
