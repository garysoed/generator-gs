const BaseGenerator = require('../common/base-generator');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Selecting a task ...']);
  }

  main() {
    super.main();
  }

  _prompting() {
    return this
        .prompt([
          {
            type: 'list',
            name: 'task',
            message: 'Which task do you want to run?',
            choices: [
              'bazel',
              'dir',
              'project',
              'ts',
            ],
          },
        ]);
  }

  _collecting_tasks({task}) {
    this.logger.will(`run gs:${task}`);
    return [() => {this.composeWith(`gs:${task}`)}];
  }
}
