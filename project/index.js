const BaseGenerator = require('../common/base-generator');
const mkdirp = require('mkdirp');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Setting up an empty project']);
  }

  main() {
    return this._create_files();
  }

  _create_files() {
    this.logger.will('generate ${0}', '.gitignore');
    this.fs.copy('../dev/.gitignore', '.gitignore');

    this.logger.will('create ${0} and ${1} directories', 'src/', 'external/');
    mkdirp('src');
    mkdirp('external');
    return Promise.resolve();
  }
};
