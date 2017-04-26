const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Sets up an empty project');
  }

  copyFiles() {
    this.log('Copying initial files ...');
    this.fs.copy('../dev/.gitignore', '.gitignore');
    mkdirp('src');
    mkdirp('external');
  }

  followUp() {
    this.composeWith(require.resolve('../code'));
  }
};
