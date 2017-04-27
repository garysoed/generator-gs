const chalk = require('chalk');

const MAX_COL = 80;

module.exports = class {
  constructor(generator) {
    this.generator_ = generator;
    this.level_ = 0;
  }

  _get_indent(level) {
    let indent = '';
    for (let i = 0; i < level; i++) {
      indent += '  ';
    }
    return indent;
  }

  _format_msg(format, values) {
    let formatted = format;
    values.forEach((value, index) => {
      formatted = formatted.replace(new RegExp(`\\$\\{${index}\\}`, 'g'), chalk.bold(value));
    });
    return formatted;
  }

  _log(msg) {
    this.generator_.log(msg);
  }

  _log_progress(logo, formatFn, msg) {
    const formattedLogo = formatFn(logo);
    this._log(`${this._get_indent(this.level_)}${formattedLogo} ${msg}`);
  }

  info(msg, ...values) {
    this._log_progress('•', chalk.blue, this._format_msg(msg, values));
  }

  error(msg, ...values) {
    this._log_progress('‼', chalk.red, this._format_msg(msg, values));
  }

  header(lines) {
    this.space();
    lines.forEach((line) => {
      this._log(line);
    });
  }

  listItem(item, ...values) {
    this.level_++;
    this._log_progress('-', chalk.white.bold, this._format_msg(item, values));
    this.level_--;
  }

  space() {
    this._log('');
  }

  substep(callback) {
    this.level_++;
    callback();
    this.level_--;
  }

  warn(line, ...values) {
    this._log_progress('!', chalk.yellow, this._format_msg(msg, values));
  }

  will(line, ...values) {
    this._log_progress('‣', chalk.blue, this._format_msg(`Will ${line} ...`, values));
  }
}
