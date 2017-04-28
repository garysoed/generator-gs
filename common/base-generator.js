const Generator = require('yeoman-generator');
const Log = require('./log');
const RootConfig = require('./root-config');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.logger = new Log(this);
    this.gsConfig = new RootConfig(this);
  }

  _exec_step(msg, substepName, ...args) {
    this.logger.info(`${msg} ...`);
    return this.logger.substep(() => {
      return this[substepName].apply(this, args);
    })
  }

  // Methods to override.
  _initializing() { }

  _prompting(initData) { }

  _consolidating(initData, promptData) {
    const mixin = {};
    for (const key in initData) {
      mixin[key] = initData[key];
    }
    for (const key in promptData) {
      mixin[key] = promptData[key];
    }

    return mixin;
  }

  _checking(data) {
    return true;
  }

  _running_tasks(data) { }

  main() {
    return Promise.resolve()
        .then(() => {
          return this.initializing() || {};
        })
        .then((initData) => {
          return Promise.all([
            initData,
            this.prompting(initData) || {}
          ]);
        })
        .then(([initData, promptData]) => {
          this.logger.space();
          return this.consolidating(initData, promptData);
        })
        .then((data) => {
          return Promise.all([this.checking(data), data]);
        })
        .then(([passes, data]) => {
          if (!passes) {
            this.logger.no('Some conditions are not met. Terminating ...');
            return [data, {_confirm: false}];
          }

          this.logger.ok('All conditions are met');
          const confirmedPromise = this.prompt([{
            type: 'confirm', name: '_confirm', message: 'OK to proceed?'
          }]);
          return Promise.all([data, confirmedPromise]);
        })
        .then(([data, {_confirm}]) => {
          this.logger.space();

          if (!_confirm) {
            this.logger.warn('Task cancelled');
            return;
          }

          return this.running(data);
        });
  }

  /**
   * Loads the configurations, etc.
   */
  initializing() {
    return this._exec_step('Initializing', '_initializing');
  }

  /**
   * Prompts the user for additional infos.
   */
  prompting(initData) {
    return this._exec_step('Prompting', '_prompting', initData);
  }

  /**
   * Consolidates the initial and prompting data collected and return them in one object, with
   * additional data derived from them.
   */
  consolidating(initData, promptData) {
    return this._exec_step('Consolidating', '_consolidating', initData, promptData);
  }

  /**
   * Checks if all the requirements are met and return true iff all the requirements are met.
   */
  checking(data) {
    return this._exec_step('Checking', '_checking', data);
  }

  /**
   * Executes all the tasks.
   */
  running(data) {
    return this._exec_step('Running tasks', '_running_tasks', data);
  }
}
