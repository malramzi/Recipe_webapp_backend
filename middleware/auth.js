const jwt = require("jsonwebtoken");
const User = require("../server/models/User");

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ error: 'No Token Authorization Header.' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).send({ error: 'Please authenticate.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message)
        res.status(401).send({ error: error.message });
    }
};
