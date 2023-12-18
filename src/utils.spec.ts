import { md5 } from './utils';
describe('utils', () => {
  describe('md5', () => {
    it('should return md5 string', () => {
      const result = md5('123456');

      expect(result).toEqual('e10adc3949ba59abbe56e057f20f883e');
    });
  });
});
