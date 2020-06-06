const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const soupifyRepository = require("../services/SoupifyRepository");

// Jwt init
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.secretOrKeyJwt;

// Jwt authenticate strategy.
const strategy = new JwtStrategy(jwtOptions, async function (
    jwt_payload,
    next
) {
    console.log("payload received", jwt_payload);

    try {
        let user = await soupifyRepository.Users.getById(jwt_payload.id);

        if (!user.is_blocked) next(null, user);
        else next(null, false);
    } catch (e) {
        next(null, false);
    }
});

passport.use("jwt", strategy);

module.exports = passport;
