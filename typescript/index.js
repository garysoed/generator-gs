const BaseGenerator = require('../common/base-generator');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Adding typescript code']);
  }

  updateConfig() {
    this.config.defaults({
      'languages': []
    });
    const languages = this.config.get('languages');
    if (languages.indexOf('typescript') < 0) {
      languages.push('typescript');
    }
    this.config.set('languages', languages);
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
