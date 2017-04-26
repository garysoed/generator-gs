const Generator = require('yeoman-generator');
const fs = require('fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Add a language to your project');
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
