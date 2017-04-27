const BaseGenerator = require('../common/base-generator');
const Language = require('../common/language');

class DependenciesBuilder {
  constructor(generator) {
    this.dependencies_ = [];
  }

  addAll(deps) {
    deps.forEach((dep) => {
      this.dependencies_.push(dep);
    });
  }

  build() {
    return Array.from(new Set(this.dependencies_));
  }
}

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.logger.header(['Setting up bazel']);
  }

  _check_requirements() {
    let passes = true;
    if (!fs.existsSync('src')) {
      passes = false;
      this.logger.error('${0} does not exist. Did you run gs:project?', 'src/');
    }
    return passes;
  }

  _ts_deps() {
    const builder = new DependenciesBuilder();
    const deps = ['karma', 'tslint', 'typescript', 'webpack'];
    this.logger.will('add ${0} bazel targets', deps.join(', '));
    builder.addAll(deps);
    return builder.build();
  }

  workspace() {
    const gsDeps = this.gsConfig.getGsDepsList();
    this.logger.info('Detected GS Deps: ${0}', gsDeps.join(','));

    const builder = new DependenciesBuilder();
    const languages = this.gsConfig.getLanguagesList();

    languages.forEach((language) => {
      switch (language) {
        case Language.TYPESCRIPT:
          this.logger.info('Detected language: ${0}', language);
          this.logger.substep(() => {
            builder.addAll(this._ts_deps());
          });
          break;
        default:
          this.logger.warn('Language ${0} is unsupported by bazel', language);
          break;
      }
    });

    this.logger.will('create ${0}', 'WORKSPACE');
    this.fs.copyTpl(
        this.templatePath('WORKSPACE'),
        this.destinationPath('WORKSPACE'),
        {
          'localRepositories': gsDeps,
          'newLocalRepositories': builder.build()
        });
  }
};
