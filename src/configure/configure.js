const until = require('../until');
const renderProp = require('../render-prop');
const drill = require('../drill');

module.exports = function configure(ShallowWrapper) {
  ShallowWrapper.prototype.renderProp = renderProp;
  ShallowWrapper.prototype.until = until;
  ShallowWrapper.prototype.drill = drill;
};
