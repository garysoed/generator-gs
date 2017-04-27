const BaseGenerator = require('../common/base-generator');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Adding GS dependency']);
  }

  main() {
    if (!this._check()) {
      return;
    }

    return this._prompting()
        .then((inputs) => {
          return this._add_dependency(inputs);
        });
  }

  _check() {
    let passes = true;
    if (!fs.existsSync('external')) {
      passes = false;
      this.logger.error('${0} does not exist. Did you run ${1}?', 'external/', 'gs:project');
    }

    if (!this.fs.exists('package.json')) {
      passes = false;
      this.logger.error('${0} does not exist. Did you run ${1}?', 'package.json', 'npm init');
    }
    return passes;
  }

  _prompting() {
    return this
        .prompt([
          {
            type: 'input',
            name: 'npm',
            message: 'What is the name of the gs npm dependency?'
          }
        ]);
  }

  _add_dependency({npm}) {
    this.logger.will('install node module ${0}', `garysoed/${npm}`);
    this.npmInstall(`garysoed/${npm}`, {'save': true});

    const name = npm.replace(/-/g, '_');
    const target = `node_modules/${npm}`;
    const path = `external/${name}`;

    this.gsConfig.addGsDeps(name);

    this.logger.will('create symlink ${0} --> ${1}', path, target);
    fs.symlinkSync(`../${target}`, path);
  }
};
