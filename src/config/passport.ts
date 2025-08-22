/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";

passport.use(
	new GoogleStrategy(
		{
			clientID: envVars.GOOGLE_CLIENT_ID,
			clientSecret: envVars.GOOGLE_CLIENT_SECRET,
			callbackURL: envVars.GOOGLE_CALLBACK_URL,
		},
		async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
			try {
				const email = profile.emails?.[0].value;
				if (!email) {
					return done(null, false, { message: "Email Not Found!" });
				}

				let existingUser = await User.findOne({ email });

				if (existingUser && (existingUser.isActive === IsActive.BLOCKED || existingUser.isActive === IsActive.INACTIVE)) {
					return done(null, false, { message: `User is ${existingUser.isActive}` });
				}

				if (existingUser && existingUser.isDeleted) {
					return done(null, false, { message: "User is deleted." });
				}

				if (existingUser && !existingUser.isVerified) {
					return done(null, false, { message: "User is not verified." });
				}

				if (!existingUser) {
					existingUser = await User.create({
						email,
						name: profile.displayName,
						picture: profile.photos?.[0].value,
						role: Role.USER,
						isVerified: true,
						auths: [
							{
								provider: "google",
								providerId: profile.id,
							},
						],
					});
				}

				return done(null, existingUser);
			} catch (error) {
				console.log("Google Strategy Error: ", error);
				return done(error);
			}
		}
	)
);

passport.serializeUser((user: any, done: (error: any, id: any) => void) => {
	done(null, user._id);
});

passport.deserializeUser(async (id: any, done: any) => {
	try {
		const user = User.findById(id);
		done(null, user);
	} catch (error) {
		console.log(error);
		done(error);
	}
});
