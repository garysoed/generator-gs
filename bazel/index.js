const BaseGenerator = require('../common/base-generator');

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
    const localRepositories = this.config.get('gsDeps') || [];
    this.logger.info('Detected GS Deps: ${0}', localRepositories.join(','));

    const builder = new DependenciesBuilder();
    const languages = this.config.get('languages') || [];

    languages.forEach((language) => {
      switch (language) {
        case 'typescript':
          this.logger.info('Detected language: ${0}', language);
          this.logger.substep(() => {
            builder.addAll(this._ts_deps(), 'typescript language');
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
          'localRepositories': localRepositories,
          'newLocalRepositories': builder.build()
        });
  }
};
