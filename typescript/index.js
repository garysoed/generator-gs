const BaseGenerator = require('../common/base-generator');
const Language = require('../common/language');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Adding typescript code']);
  }

  updateConfig() {
    this.gsConfig.addLanguage(Language.TYPESCRIPT);
  }

  tslint() {
    this.logger.will('create ${0}', 'tslint.json');
    this.fs.copyTpl(
        this.templatePath('tslint.json'),
        this.destinationPath('tslint.json'),
        {});
  }

  tsconfig() {
    this.logger.will('create ${0}', 'tsconfig.json');
    this.fs.copyTpl(
        this.templatePath('tsconfig.json'),
        this.destinationPath('tsconfig.json'),
        {});
  }
};
