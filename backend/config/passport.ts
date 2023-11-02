import { PassportStatic } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { IUserDocument } from "../interfaces/user.ts";
import User from "../models/userModel.ts";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Replace with your secret key
};

export default function (passport: PassportStatic) {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.sub, (err: unknown, user: IUserDocument) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        return done(null, false);
      }).select("-password");
    })
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            email,
          });

          if (!user) {
            return done(null, false, { message: "User not found." });
          }

          if (!user.matchPassword(password)) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
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
          email: profile.emails !== undefined && profile?.emails[0].value,
          firstName: profile?.name?.givenName,
          lastName: profile?.name?.familyName,
          imageUrl: profile.photos !== undefined && profile?.photos[0].value,
        };

        let user = (await User.findOne({
          googleId: profile.id,
        }).select("-password")) as IUserDocument;

        if (user) {
          done(null, user, { statusCode: 200 });
        } else {
          user = await User.create(newUser);
          done(null, user, { statusCode: 201 });
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
