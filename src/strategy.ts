import OAuth2Strategy, { InternalOAuthError, StrategyOptions } from 'passport-oauth2';
import { SquareStrategyOptions, VerifyFunction } from './types';

/**
 * `Strategy` constructor.
 *
 * The Square authentication strategy authenticates requests by delegating to
 * Square using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `err` should be set.
 *
 * Options:
 *   - `clientId`      	your Square application's client id
 *   - `clientSecret`  	your Square application's client secret
 *   - `callbackURL`   	URL to which Square will redirect the user after granting authorization (optional of set in your Square Application
 *   - `grant_type`     Must be authorization_code
 *   - `userProfileURL` URL from with the user profile will be fetched, a `/v1/merchants/me` endpoint on either `connect.squareupsandbox.com` or `connect.squareup.com`
 *
 * Examples:
 *
 *     passport.use(new SquareStrategy({
 *         client_id: '123-456-789',
 *         client_secret: 'shhh-its-a-secret'
 *         redirect_uri: 'https://www.example.net/auth/square/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 */

export class SquareStrategy extends OAuth2Strategy {
  _userProfileURL: string;

  constructor(options: SquareStrategyOptions, verify: VerifyFunction) {
    options = options || {};
    // http://developers.Square.com/oauth/
    options.authorizationURL = options.authorizationURL || 'https://connect.squareup.com/oauth2/authorize';
    options.tokenURL = options.tokenURL || 'https://connect.squareup.com/oauth2/token';
    options.scope =
      options.scope ||
      'MERCHANT_PROFILE_READ,PAYMENTS_READ,PAYMENTS_WRITE,SETTLEMENTS_READ,ITEMS_READ,ITEMS_WRITE,ORDERS_READ,ORDERS_WRITE';
    options.scopeSeparator = options.scopeSeparator || ',';
    options.grant_type = options.grant_type || 'authorization_code';
    super(options as StrategyOptions, verify);
    this.name = 'square';
    this._userProfileURL = options.userProfileURL || 'https://connect.squareup.com/v2/merchants/me';
  }

  /**
   * Retrieve the merchant profile from Square, see
   * https://developer.squareup.com/reference/square/merchants-api/retrieve-merchant
   * for details
   *
   * This function constructs a normalized profile, with the following properties:
   *
   *   - `provider`       always set to `square`
   *   - `id`             `merchant.id`, The Square-issued ID of the merchant.
   *   - `businessName`   `merchant.business_name`, The business name of the merchant.
   *   - `country`        `merchant.country`, The country code associated with the merchant account, in ISO 3166 format.
   *   - `languageCode`   `merchant.language_code`, The language code associated with the merchant account, in BCP 47 format.
   *   - `currency`       `merchant.currency`, The currency associated with the merchant account, in ISO 4217 format.
   *   - `mainLocationId` `merchant.main_location_id`, The ID of the main Location for this merchant.
   *   - `status`         `merchant.status`, The merchant status, active or inactive.
   *
   *
   * @param {String} accessToken
   * @param {Function} done
   * @api protected
   */

  userProfile(accessToken: string, done: (err: any, user?: any) => void): void {
    const authorization = 'Bearer ' + accessToken;
    const headers = {
      Authorization: authorization,
    };

    // @ts-ignore
    this._oauth2._request('GET', this._userProfileURL, headers, '', '', (err, body) => {
      if (err) {
        return done(new InternalOAuthError('failed to fetch user profile', err));
      }

      try {
        const merchant = JSON.parse(body as string).merchant;

        const profile = {
          provider: 'square',
          id: merchant.id,
          businessName: merchant.business_name,
          country: merchant.country,
          languageCode: merchant.language_code,
          currency: merchant.currency,
          status: merchant.status,
          mainLocationId: merchant.main_location_id,
          _squareProfile: merchant,
        };

        done(null, profile);
      } catch (e) {
        done(e);
      }
    });
  }
}
