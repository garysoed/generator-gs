const BaseGenerator = require('../common/base-generator');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Setting up an empty project']);
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
    this.logger.will('generate ${0}', '.gitignore');
    this.fs.copy('../dev/.gitignore', '.gitignore');

    this.logger.will('create ${0} and ${1} directories', 'src/', 'external/');
    mkdirp('src');
    mkdirp('external');
  }
};
