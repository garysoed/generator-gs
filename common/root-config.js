const BaseConfig = require('./base-config');
const Language = require('./language');

const Key = {
  GS_DEPS: 'gsDeps',
  LANGUAGES: 'languages',
  MAIN_BAZEL_TARGET: 'mainBazelTarget',
  PROJECT_NAME: 'name'
}

module.exports = class extends BaseConfig {
  constructor(generator) {
    super(generator, null);

    this._defaults(this._get_defaults());
  }

  _add_to_set(item, key) {
    const set = this._get(key);
    if (set.indexOf(item) >= 0) {
      return;
    }

    set.push(item);
    this._set(key, set);
  }

  _get_defaults() {
    return {
      [Key.GS_DEPS]: [],
      [Key.LANGUAGES]: [],
      [Key.PROJECT_NAME]: 'Unnamed project'
    };
  }

  addGsDeps(deps) {
    this._add_to_set(deps, Key.GS_DEPS);
  }

  getGsDepsList() {
    return this._get(Key.GS_DEPS);
  }

  addLanguage(language) {
    this._add_to_set(Language.code(language), Key.LANGUAGES);
  }

  getLanguagesList() {
    return this._get(Key.LANGUAGES).map((code) => {
      return Language.fromCode(code);
    });
  }

  getProjectName() {
    return this._get(Key.PROJECT_NAME);
  }

  setProjectName(projectName) {
    this._set(Key.PROJECT_NAME, projectName);
  }

  getMainBazelTarget() {
    return this._get(Key.MAIN_BAZEL_TARGET);
  }

  setMainBazelTarget(target) {
    this._set(Key.MAIN_BAZEL_TARGET, target);
  }
};
