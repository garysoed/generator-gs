const Language = {
  TYPESCRIPT: {code: 'typescript', key: 't', render: 'Typescript'},

  code(language) {
    return language.code;
  },

  fromCode(code) {
    for (const key in Language) {
      const language = Language[key];
      if (language.code === code) {
        return language;
      }
    }

    return null;
  },

  key(language) {
    return language.key;
  },

  render(language) {
    return language.render;
  }
};

module.exports = Language;
