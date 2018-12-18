const until = require('../until');
const drill = require('../drill');

module.exports = function configure(ShallowWrapper) {
  ShallowWrapper.prototype.until = until;
  ShallowWrapper.prototype.drill = drill;
};
