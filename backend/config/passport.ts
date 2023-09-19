import { PassportStatic } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { IUserDocument } from "../interfaces/user.ts";
import User from "../models/userModel.ts";

export default function (passport: PassportStatic) {
  passport.use(
    new LocalStrategy(async (email, password, done) => {
      await User.findOne(
        { email },
        async (err: unknown, user: IUserDocument) => {
          if (err) return done(err);
          if (!user || !(await user.matchPassword(password))) {
            return done(null, false, { message: "Invalid email or password" });
          }
          return done(null, user);
        }
      );
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/api/auth/google/callback",
      },
      async (token, tokenSecret, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile?.name?.givenName,
          lastName: profile?.name?.familyName,
          image: profile.photos !== undefined && profile?.photos[0].value,
        };

        let user = (await User.findOne({
          googleId: profile.id,
        })) as IUserDocument;

        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user: Partial<IUserDocument>, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
