const until = require('../until');
const renderProp = require('../render-prop');

module.exports = function configure(ShallowWrapper) {
  ShallowWrapper.prototype.renderProp = renderProp;
  ShallowWrapper.prototype.until = until;
};
