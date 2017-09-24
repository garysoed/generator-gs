const BaseGenerator = require('../common/base-generator');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Creating a new directory ...']);
  }

  main() {
    return super.main();
  }

  _initializing() {
    return {
      mainBazelTarget: this.gsConfig.getMainBazelTarget()
    };
  }

  _prompting() {
    return this
        .prompt([
          {
            type: 'input',
            name: 'dirName',
            message: 'What is the name of the new directory?'
          }
        ]);
  }

  _checking({mainBazelTarget}) {
    let passes = true;
    if (!mainBazelTarget) {
      passes = false;
      this.logger.no('${0} not found. Did you run ${1}?', 'Main Bazel target', 'gs:bazel');
    } else {
      this.logger.ok('Main bazel target is ${0}', mainBazelTarget);
    }

    if (!fs.existsSync('src')) {
      passes = false;
      this.logger.no('${0} directory not found. Did you run ${1}?', 'src/', 'gs:project');
    } else {
      this.logger.ok('${0} directory exists', 'src/');
    }

    return passes;
  }

  _collecting_tasks({dirName, mainBazelTarget}) {
    const tasks = [];
    const fullDirName = `src/${dirName}`;
    this.logger.will('create directory ${0}', fullDirName);
    tasks.push(() => {mkdirp(fullDirName)});

    this.logger.will('create ${0} file in ${1}', 'BUILD', fullDirName);
    tasks.push(() => {
      this.fs.copyTpl(
          this.templatePath('BUILD'),
          this.destinationPath(`${fullDirName}/BUILD`),
          {
            'mainBazelTarget': mainBazelTarget
          });
    });

    return tasks;
  }
};
