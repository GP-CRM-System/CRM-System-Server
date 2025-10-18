// // Configuration for Passport.js to handle OAuth2.0 authentication

// import passport, { type Profile } from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// // import { IUser, User } from '../models/user.model.js';
// import { logger } from './logger.config.js';
// import { type Application } from 'express';
// import dotenv from 'dotenv';
// dotenv.config({ quiet: true });



// export default function passportSetup(app: Application): void {

//   app.use(passport.initialize());
//   app.use(passport.session());


//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   passport.serializeUser((user: any, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser(async (id: string, done) => {
//     try {
//       const user = await User.findById(id).select('-password');
//       done(null, user);
//     } catch (error) {
//       done(error, null);
//     }
//   });

//   passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     callbackURL: process.env.GOOGLE_REDIRECT_URI!,
//     scope: ['profile', 'email']
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   }, async (accessToken: string, refreshToken: string, profile: Profile, done: (error: Error | null, user?: any) => void) => {
//     try {
//       const user = await findOrCreateUser(profile, 'google');
//       return done(null, user);
//     } catch (error: unknown) {
//       logger.error(error);
//       return done(error as Error, undefined);
//     }
//   }));
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// async function findOrCreateUser(profile: any, provider: 'google'): Promise<IUser> {
//   try {
//     let user = await User.findOne({
//       oauthProvider: provider,
//       oauthId: profile.id
//     });

//     if (user) return user;

//     if (profile.emails?.[0]?.value) {
//       user = await User.findOne({ email: profile.emails[0].value });

//       if (user) {
//         user.oauth = provider;
//         user.oauthId = profile.id;
//         await user.save();
//         return user;
//       }
//     }

//     const userData = {
//       oauth: provider,
//       oauthId: profile.id,
//       name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`,
//       email: profile.emails?.[0]?.value,
//     };

//     user = await User.create(userData);
//     return user;
//   } catch (error) {
//     logger.error(`Error finding/creating user: ${error}`);
//     throw error;
//   }
// }

