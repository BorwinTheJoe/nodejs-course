const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: 'Username and Password are required.' });

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
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current User. Later, Connect to database
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        //We send the cookie with the Refresh token as httpOnly as it's inaccessible with js!
        res.cookie('jwt', refreshToken, {
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
