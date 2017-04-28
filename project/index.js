const BaseGenerator = require('../common/base-generator');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Setting up an empty project']);
  }

  main() {
    return super.main();
  }

  _prompting() {
    return this
        .prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'What is the name of your project?',
            default: this.appname
          }
        ]);
  }

  _running_tasks({projectName}) {
    this.logger.will('generate ${0}', '.gitignore');
    this.fs.copy('../dev/.gitignore', '.gitignore');

    this.logger.will('create ${0} and ${1} directories', 'src/', 'external/');
    mkdirp('src');
    mkdirp('external');

    this.logger.will(`set project name to ${projectName}`);
    this.gsConfig.setProjectName(projectName);
    return Promise.resolve();
  }
};
