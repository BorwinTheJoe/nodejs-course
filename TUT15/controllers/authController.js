const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and Password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    // Evaluating password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs (Json Web Tokens)
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const newRefreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        // Changed to let keyword
        let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

        if (cookies?.jwt) {
            /*
            Scenario Added here:
                1) User logs in but never uses RT and does not logout
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            if (!foundToken) {
                console.log('attempted refresh token reuse at login!');
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            });
        }

        // Saving refreshToken with current User. Later, Connect to database
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);

        //We send the cookie with the Refresh token as httpOnly as it's inaccessible with js!
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        }); // Secure: true, but in Production needs to be False, or can't run tests!
        res.json({ accessToken }); //STORE IN MEMORY! LocalStorage and Cookie is Unsafe!
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };
