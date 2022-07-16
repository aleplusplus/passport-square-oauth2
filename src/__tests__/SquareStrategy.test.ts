import { SquareStrategy } from '../index';

describe('SquareStrategy', function () {
  describe('constructed', function () {
    describe('with normal options', function () {
      var strategy = new SquareStrategy(
        {
          authorizationURL: 'https://www.example.com/oauth2/authorize',
          tokenURL: 'https://www.example.com/oauth2/token',
          clientID: 'ABC123',
          clientSecret: 'secret',
        },
        function () {},
      );

      it('should be named oauth2', function () {
        expect(strategy.name).toEqual('square');
      });
    }); // with normal options
  }); // constructed
}); // OAuth2Strategy
