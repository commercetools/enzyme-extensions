/* eslint-disable no-param-reassign */
import until from '../until';
import drill from '../drill';

export default function configure(ShallowWrapper) {
  ShallowWrapper.prototype.until = until;
  ShallowWrapper.prototype.drill = drill;
}
