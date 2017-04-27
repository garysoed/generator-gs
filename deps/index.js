const BaseGenerator = require('../common/base-generator');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Adding GS dependency(s)']);
  }

  _add_dependencies() {
    return this
        .prompt([
          {
            type: 'input',
            name: 'npm',
            message: 'What is the name of the gs npm dependency? Empty string to stop adding.'
          }
        ])
        .then(({npm}) => {
          if (npm === '') {
            return null;
          }

          this.logger.will('install node module ${0}', `garysoed/${npm}`);
          this.npmInstall(`garysoed/${npm}`, {'save': true});
          return npm;
        })
        .then((npm) => {
          if (npm === null) {
            this.logger.will('stop adding any more dependencies');
            return;
          }

          const name = npm.replace(/-/g, '_');
          const target = `node_modules/${npm}`;
          const path = `external/${name}`;

          const gsDeps = this.config.get('gsDeps');
          gsDeps.push(name);
          this.config.set('gsDeps', gsDeps);

          this.logger.will('create symlink ${0} --> ${1}', path, target);
          fs.symlinkSync(`../${target}`, path);

          this.logger.space();
          return this._add_dependencies();
        });
  }

  _check_requirements() {
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

  updateConfig() {
    this.config.defaults({
      'gsDeps': []
    });
  }

  dependencies() {
    if (!this._check_requirements()) {
      return;
    }

    return this._add_dependencies();
  }
};
