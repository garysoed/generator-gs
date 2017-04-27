const Generator = require('yeoman-generator');
const Log = require('./log');
const RootConfig = require('./root-config');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.logger = new Log(this);
    this.gsConfig = new RootConfig(this);
  }
}
