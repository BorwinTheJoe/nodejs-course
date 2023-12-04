const usersDB = {
    users: require('../model/users.json'),
    setUser: function (data) { this.users = data }
};
const bcrypt = require('bcrypt');

const jwt = require ('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': "Username and Password are required."});
    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); // UnAuthorized
    // Evaluating password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTs (Json Web Tokens)
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current User. Later, Connect to database
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUser([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        //We send the cookie with the Refresh token as httpOnly as it's inaccessible with js!
        res.cookie('jwt', refreshToken,  { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken }); //STORE IN MEMORY! LocalStorage and Cookie is Unsafe!
        

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };