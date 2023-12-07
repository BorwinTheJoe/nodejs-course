const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: 'Username and Password are required.' });

    // Check for duplicate usernames in the database.
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); // HTTP code for Conflict

    try {
        // Encrypt the Password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // Create and Store the new User
        const result = await User.create({
            username: user,
            password: hashedPwd
        });

        /* // Can also do it This way.
        const newUser = new User();
        newUser.username = user;
        newUser.password = hashedPwd;
        const result = await newUser.save();
        */

        console.log(result);
        res.status(201).json({ message: `New User "${user}" created!` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };
