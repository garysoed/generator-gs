const BaseConfig = require('./base-config');

const Key = {
  GS_DEPS: 'gsDeps',
  LANGUAGES: 'languages'
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
      [Key.LANGUAGES]: []
    };
  }

  addGsDeps(deps) {
    this._add_to_set(deps, Key.GS_DEPS);
  }

  getGsDepsList() {
    return this._get(Key.GS_DEPS);
  }

  addLanguage(language) {
    this._add_to_set(language, Key.LANGUAGES);
  }

  getLanguagesList() {
    return this._get(Key.LANGUAGES);
  }
};
