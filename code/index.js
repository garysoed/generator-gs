const BaseGenerator = require('../common/base-generator');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Addding a language to your project']);
  }

  promptLanguage() {
    return this
        .prompt([
          {
            type: 'list',
            name: 'language',
            message: 'What language do you want to add?',
            choices: [
              {key: 't', name: 'Typescript', value: 'typescript'}
            ]
          }
        ])
        .then(({language}) => {
          this.composeWith(require.resolve(`../${language}`));
        });
  }
};
