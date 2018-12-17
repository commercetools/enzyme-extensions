const configure = require('./configure');

const ShallowWrapper = function() {};

describe('configure', () => {
  beforeAll(() => {
    configure(ShallowWrapper);
  });

  describe('`until`', () => {
    it('should be assigned on the passed `ShallowWrapper` prototype', () => {
      expect(ShallowWrapper.prototype).toHaveProperty(
        'until',
        expect.any(Function)
      );
    });
  });

  describe('`drill`', () => {
    it('should be assigned on the passed `ShallowWrapper` prototype', () => {
      expect(ShallowWrapper.prototype).toHaveProperty(
        'drill',
        expect.any(Function)
      );
    });
  });
});
