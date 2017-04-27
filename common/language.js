const Language = {
  TYPESCRIPT: 'ts',

  render(language) {
    switch (language) {
      case Language.TYPESCRIPT:
        return 'Typescript';
    }
  }
};

module.exports = Language;
