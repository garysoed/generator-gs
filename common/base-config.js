module.exports = class {
  constructor(generator, rootKey) {
    this.config_ = generator.config;
    this.generator_ = generator;
    this.rootKey_ = rootKey;
  }

  _defaults(value) {
    if (this.rootKey_ === null) {
      this.config_.defaults(value);
      return;
    }

    this.config_.defaults({[this.rootKey_]: value});
  }

  _get(key) {
    if (this.rootKey_ === null) {
      return this.config_.get(key);
    }

    const obj = this.config_.get(this.rootKey_);
    return obj[key];
  }

  _set(key, value) {
    if (this.rootKey_ == null) {
      this.config_.set(key, value);
      return;
    }

    const obj = this.config_.get(this.rootKey_);
    obj[key] = value;
    this.config_.set(this.rootKey_, obj);
  }
};
