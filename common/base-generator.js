const Generator = require('yeoman-generator');
const Log = require('./log');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.logger = new Log(this);
  }
}
