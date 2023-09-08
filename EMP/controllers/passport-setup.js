// npm install passport passport-google-oauth

const client = require('../connections/db');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: '982659000592-sdm5s7s7k0ggav42r5l4ko5gfgq63n75.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:4000/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            //check if user is already register in database or not 
            const query = `select * from socialMediaUsers where id = $1`;
            const values = [profile.id];
            const result = await client.query(query, values);

            if (result.rows.length > 0) {
                return done(null, result.row[0]);
            }
            else {
                const CreateTable = `create table if not exists socialMediaUsers(id,name,email)`
                await client.query(CreateTable, (err) => {
                    console.log(err)
                })
                const newUserQuery = `INSERT INTO socialMediaUsers(id,name,email) values('${profile.id}','${profile.displayName}','${profile.emails[0].value}')`
                await client.query(newUserQuery)
                done(null, newUserQuery.rows[0]);
            }
        }
        catch (err) {
            throw err;
        }
    }
))