import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Application } from 'express';
import dotenv from 'dotenv';
import { logger } from './logger.config.js';
import Employee from '../models/employee.model.js';
dotenv.config({ quiet: true });

export default function passportSetup(app: Application): void {
  app.use(passport.initialize());

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
    logger.error("Google OAuth credentials not found")
    throw new Error('Google OAuth credentials not found');
  }

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    scope: ['profile', 'email'],
  }, async function verify(
    _accessToken: string,
    _refreshToken: string,
    profile: passport.Profile,
    done: passport.DoneCallback
  ): Promise<void> {

    try {
      const emp = await Employee.findOne({ email: profile?.emails?.[0]?.value });
      if (emp) {
        return done(null, emp);
      }
      return done("User not found", null);
    } catch (error: unknown) {
      logger.error(`Google OAuth error: ${error}`);
      return done(error, null);
    }
  }));

}