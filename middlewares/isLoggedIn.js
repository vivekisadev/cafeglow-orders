const jwt = require('jsonwebtoken');

const LoggedIn = (req, res, next) => {
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.token;
    
    if (!token) {
        // Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }
    
    console.log('Token found:', token ? 'Yes' : 'No');
    console.log('Cookies:', req.cookies);
    console.log('Authorization header:', req.headers.authorization);
    
    if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('Using JWT secret:', jwtSecret);
    
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            console.log('JWT verification error:', err.message);
            console.log('Token received:', token);
            return res.status(401).send({ message: "Unauthorized" });
        }
        console.log('JWT decoded successfully:', decoded);
        req.user = decoded;
        next();

    });
};

module.exports = LoggedIn;
