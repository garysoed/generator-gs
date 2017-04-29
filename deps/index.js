const BaseGenerator = require('../common/base-generator');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Adding GS dependency']);
  }

  main() {
    return super.main();
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

  _checking() {
    let passes = true;
    if (!fs.existsSync('external')) {
      passes = false;
      this.logger.no('${0} does not exist. Did you run ${1}?', 'external/', 'gs:project');
    } else {
      this.logger.ok('${0} directory exists', 'external/');
    }

    if (!this.fs.exists('package.json')) {
      passes = false;
      this.logger.no('${0} does not exist. Did you run ${1}?', 'package.json', 'npm init');
    } else {
      this.logger.ok('${0} exists', 'package.json');
    }
    return passes;
  }

  _collecting_tasks({npm}) {
    const tasks = [];
    this.logger.will('install node module ${0}', `garysoed/${npm}`);
    tasks.push(() => {
      this.npmInstall(`garysoed/${npm}`, {'save': true});
    });

    const name = npm.replace(/-/g, '_');
    const target = `node_modules/${npm}`;
    const path = `external/${name}`;

    this.gsConfig.addGsDeps(name);

    this.logger.will('create symlink ${0} -> ${1}', path, target);
    tasks.push(() => {
      fs.symlinkSync(`../${target}`, path);
    });
    return tasks;
  }
};
