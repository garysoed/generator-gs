const BaseGenerator = require('../common/base-generator');
const Language = require('../common/language');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Adding a language to your project']);
  }

  main() {
    return this._prompting()
        .then((inputs) => {
          return this._compose(inputs);
        });
  }

  _prompting() {
    const choices = [];
    for (const key in Language) {
      const language = Language[key];
      if (language instanceof Function) {
        continue;
      }

      choices.push({
        key: Language.key(language),
        name: Language.render(language),
        value: Language.code(language)
      });
    }
    return this
        .prompt([
          {
            type: 'list',
            name: 'language',
            message: 'What language do you want to add?',
            choices
          }
        ]);
  }

  _compose({language}) {
    this.composeWith(require.resolve(`../${language}`));
  }
};
