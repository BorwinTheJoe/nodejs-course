const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        // Mapping roles acquired from the JWT which is assigned in the verified JWT.
        // Comparing it with a roles array that will be passed into this route - depending on what destination is requested.
        // if there's any trues (aka. the user has a role that has access), we find it and return true.
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true); 
        // If there's no true result
        if (!result) return res.sendStatus(401); // Access Unauthorized!
        next(); // Otherwise, continue! All is alright!
    }
}

module.exports = verifyRoles;