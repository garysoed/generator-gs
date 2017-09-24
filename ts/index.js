const BaseGenerator = require('../common/base-generator');
const Language = require('../common/language');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Adding typescript code']);
  }

  main() {
    return super.main();
  }

  _collecting_tasks() {
    const tasks = [];
    this.logger.will('add ${0}', Language.render(Language.TYPESCRIPT));
    tasks.push(() => {
      this.gsConfig.addLanguage(Language.TYPESCRIPT);
    });

    this.logger.will('create ${0}', 'tslint.json');
    tasks.push(() => {
      this.fs.copyTpl(
          this.templatePath('tslint.json'),
          this.destinationPath('tslint.json'),
          {});
    });

    this.logger.will('create ${0}', 'tsconfig.json');
    tasks.push(() => {
      this.fs.copyTpl(
          this.templatePath('tsconfig.json'),
          this.destinationPath('tsconfig.json'),
          {});
    });

    this.logger.will('install ${0} from npm', 'typescript');
    tasks.push(() => {
      this.npmInstall('typescript', {'save': true});
    });

    this.logger.will('install ${0} from npm', 'tslint');
    tasks.push(() => {
      this.npmInstall('tslint', {'save': true});
    })

    return tasks;
  }
};
