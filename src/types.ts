import { OutgoingHttpHeaders } from 'http';
import { StateStore, VerifyFunction } from 'passport-oauth2';

interface StrategyOptions {
  authorizationURL?: string;
  tokenURL?: string;
  clientID: string;
  clientSecret: string;
  callbackURL?: string | undefined;
  customHeaders?: OutgoingHttpHeaders | undefined;
  scope?: string | string[] | undefined;
  scopeSeparator?: string | undefined;
  sessionKey?: string | undefined;
  store?: StateStore | undefined;
  state?: any;
  skipUserProfile?: any;
  pkce?: boolean | undefined;
  proxy?: any;
  passReqToCallback?: false | undefined;
  grant_type?: string;
  userProfileURL?: string;
}

export type { StrategyOptions, VerifyFunction };
