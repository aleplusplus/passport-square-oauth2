import { StrategyOptions, VerifyFunction } from 'passport-oauth2';


interface SquareStrategyOptions extends StrategyOptions {
    grant_type?: string;
    userProfileURL?: string;
}

export { SquareStrategyOptions, VerifyFunction };