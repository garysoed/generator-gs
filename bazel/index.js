const BaseGenerator = require('../common/base-generator');
const Language = require('../common/language');
const fs = require('fs');

class GsBazelDepsBuilder {
  constructor() {
    this.map_ = new Map();
  }

  add(from, target) {
    const normalizedFrom = `@gs_tools//bazel/${from}:defs.bzl`;
    if (!this.map_.has(normalizedFrom)) {
      this.map_.set(normalizedFrom, new Set([]));
    }
    this.map_.get(normalizedFrom).add(target);
  }

  build() {
    const deps = [];
    this.map_.forEach((targets, from) => {
      deps.push({from, targets: Array.from(targets)});
    });
    return deps;
  }
}

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

  _get_bazel_deps(languages) {
    const builder = new DependenciesBuilder();
    this.logger.substep(() => {
      languages.forEach((language) => {
        switch (language) {
          case Language.TYPESCRIPT:
            builder.addAll(this._ts_deps());
            break;
          default:
            this.logger.warn('Language ${0} is unsupported by bazel', language);
            break;
        }
      });
    });
    return builder.build();
  }

  _ts_deps() {
    const builder = new DependenciesBuilder();
    const deps = ['karma', 'tslint', 'typescript', 'webpack'];
    builder.addAll(deps);
    return builder.build();
  }

  main() {
    return super.main();
  }

  _initializing() {
    const gsDeps = this.gsConfig.getGsDepsList();
    this.logger.info('Detected GS Deps: ${0}', gsDeps.join(', '));

    const languages = this.gsConfig.getLanguagesList();
    const languagesString = languages
        .map((language) => {
          return Language.render(language);
        })
        .join(', ');
    this.logger.info('Detected languages: ${0}', languagesString);

    const bazelDeps = this._get_bazel_deps(languages);
    this.logger.info('Detected Bazel deps: ${0}', bazelDeps.join(', '));
    return {gsDeps, languages, bazelDeps};
  }

  _prompting(initData) {
    return this
        .prompt([
          {
            type: 'confirm',
            name: 'isWebapp',
            message: 'Is this a web app?'
          },
          {
            type: 'input',
            name: 'mainDir',
            message: 'What is the directory of the main file (relative to src)?',
            when({isWebapp}) {
              return isWebapp;
            }
          },
          {
            type: 'input',
            name: 'mainFile',
            message({mainDir}) {
              return `What is the name of the generated main file in src/${mainDir}?`;
            },
            when({isWebapp}) {
              return isWebapp;
            }
          }
        ]);
  }

  _consolidating(initData, promptData) {
    const data = super._consolidating(initData, promptData);

    // Add additional data.
    const {isWebapp, languages} = data;
    const hasTypescript = languages.indexOf(Language.TYPESCRIPT) >= 0;
    const gsBazelDepsBuilder = new GsBazelDepsBuilder();
    if (hasTypescript) {
      gsBazelDepsBuilder.add('karma', 'karma_run');
      gsBazelDepsBuilder.add('ts', 'ts_binary');
      gsBazelDepsBuilder.add('ts', 'ts_library');
    }

    if (isWebapp) {
      gsBazelDepsBuilder.add('webpack', 'webpack_binary');
    }

    data.gsBazelDeps = gsBazelDepsBuilder.build();
    return data;
  }

  _checking({gsBazelDeps}) {
    let passes = true;
    if (gsBazelDeps.length > 0) {
      if (!fs.existsSync(this.destinationPath('external/gs_tools'))) {
        this.logger.no(
            '${0} not found. Did you add ${1} as deps?', 'external/gs_tools', 'gs-tools');
        passes = false;
      } else {
        this.logger.ok('Required dependency ${0} found', 'gs-tools');
      }
    }

    return passes;
  }

  _running_tasks(data) {
    return Promise.all([
      this._build_task(data),
      this._workspace_task(data)
    ]);
  }

  _workspace_task({gsDeps, bazelDeps}) {
    this.logger.will('create ${0}', 'WORKSPACE');
    this.logger.substep(() => {
      this.logger.will('add the bazel deps:');
      bazelDeps.forEach((dep) => {
        this.logger.listItem('${0}', dep);
      });

      this.logger.will('add the gsDeps:');
      gsDeps.forEach((dep) => {
        this.logger.listItem('${0}', dep);
      });
      this.fs.copyTpl(
          this.templatePath('WORKSPACE'),
          this.destinationPath('WORKSPACE'),
          {
            'localRepositories': gsDeps,
            'newLocalRepositories': bazelDeps
          });
    });
  }

  _build_task({languages, isWebapp, mainDir, mainFile, gsBazelDeps}) {
    this.logger.will('create root ${0}', 'BUILD');
    this.logger.substep(() => {
      const hasTypescript = languages.indexOf(Language.TYPESCRIPT) >= 0;
      this.logger.info('Detected ${0}', Language.render(Language.TYPESCRIPT));

      this.logger.will('add the local repositories:');
      gsBazelDeps.forEach((gsBazelDep) => {
        gsBazelDep.targets.forEach((target) => {
          this.logger.listItem('${0}: ${1}', gsBazelDep.from, target);
        });
      });
      this.fs.copyTpl(
          this.templatePath('BUILD'),
          this.destinationPath('BUILD'),
          {
            'gsBazelDeps': gsBazelDeps,
            'hasTypescript': hasTypescript,
            'isWebapp': isWebapp,
            'mainDir': mainDir,
            'mainFile': mainFile
          });
    });
  }
};
