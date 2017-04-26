const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Sets up an empty project');
  }

  _run_gen(generator) {
    const proto = Object.getPrototypeOf(generator);
    for (const key in proto) {
      const value = proto[key];
      if (value instanceof Function) {
        value();
      }
    }
  }

  copyFiles() {
    this.log('Copying initial files ...');
    this.fs.copy('../dev/.gitignore', '.gitignore');
    mkdirp('src');
    mkdirp('external');
  }
};
