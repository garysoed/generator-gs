const Generator = require('yeoman-generator');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Adding typescript code');
  }

  _check_requirements() {
    let passes = true;
    if (!fs.existsSync('src')) {
      passes = false;
      this.log.error('src/ does not exist. Did you run gs:project?');
    }
    return passes;
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

    this.log('Languages in TS: ', this.config.get('languages'));
  }

  tslint() {
    this.fs.copyTpl(
        this.templatePath('tslint.json'),
        this.destinationPath('tslint.json'),
        {});
  }

  tsconfig() {
    this.fs.copyTpl(
        this.templatePath('tsconfig.json'),
        this.destinationPath('tsconfig.json'),
        {});
  }
};
