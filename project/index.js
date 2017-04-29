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

  _collecting_tasks({projectName}) {
    const tasks = [];
    this.logger.will('generate ${0}', '.gitignore');
    tasks.push(() => {this.fs.copy('../dev/.gitignore', '.gitignore')});

    this.logger.will('create ${0} and ${1} directories', 'src/', 'external/');
    tasks.push(() => {
      mkdirp('src');
      mkdirp('external');
    });

    this.logger.will(`set project name to ${projectName}`);
    tasks.push(() => {
      this.gsConfig.setProjectName(projectName);
    });
    return tasks;
  }
};
