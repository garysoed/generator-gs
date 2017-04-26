const Generator = require('yeoman-generator');
const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Adding typescript code');
  }

  _add_dependencies() {
    return this
        .prompt([
          {
            type: 'input',
            name: 'npm',
            message: 'What is the name of the npm dependency? Empty string to stop adding.'
          }
        ])
        .then(({npm}) => {
          if (npm === '') {
            return null;
          }

          this.npmInstall(npm, {'save': true});
          return this
              .prompt([
                {
                  type: 'input',
                  name: 'name',
                  message: `What should ${npm} be named as?`
                }
              ])
              .then(({name}) => {
                return [npm, name];
              })
        })
        .then((answers) => {
          if (answers === null) {
            return;
          }

          const [npm, name] = answers;
          const packageName = npm.indexOf('/') >= 0 ? npm.split('/')[1] : npm;
          const target = `node_modules/${packageName}`;
          const path = `external/${name}`;

          this.log(`Creating symlink ${path} --> ${target}`);
          fs.symlinkSync(`../${target}`, path);
          return this._add_dependencies();
        });
  }

  _check_requirements() {
    let passes = true;
    if (!fs.existsSync('src')) {
      passes = false;
      this.log.error('src/ does not exist. Did you run gs:project?');
    }

    if (!fs.existsSync('external')) {
      passes = false;
      this.log.error('external/ does not exist. Did you run gs:project?');
    }
    return passes;
  }

  dependencies() {
    if (!this._check_requirements()) {
      return;
    }

    this.log('Add typescript NPM dependencies');
    return this._add_dependencies();
  }
};
