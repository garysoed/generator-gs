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

  _running_tasks() {
    this.logger.will('add ${0}', Language.render(Language.TYPESCRIPT));
    this.gsConfig.addLanguage(Language.TYPESCRIPT);

    this.logger.will('create ${0}', 'tslint.json');
    this.fs.copyTpl(
        this.templatePath('tslint.json'),
        this.destinationPath('tslint.json'),
        {});

    this.logger.will('create ${0}', 'tsconfig.json');
    this.fs.copyTpl(
        this.templatePath('tsconfig.json'),
        this.destinationPath('tsconfig.json'),
        {});
  }
};
