import { Customer } from './customer';

describe('User', () => {
  it('should create an instance', () => {
    expect(new Customer('toto', true)).toBeTruthy();
  });
});
