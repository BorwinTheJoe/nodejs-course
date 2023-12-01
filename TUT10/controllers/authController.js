const usersDB = {
    users: require('../model/users.json'),
    setUser: function (data) { this.users = data }
};
const bcrypt = require('bcrypt');
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': "Username and Password are required."});
    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); // UnAuthorized
    // Evaluating password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTs (What is a JWT?)
        res.json({ 'message': `User ${user} is Logged In!`});
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };