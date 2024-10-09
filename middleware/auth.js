import jwt from 'jsonwebtoken';
export const verifyToken = (req) => {
    const { authToken } = req.cookies;

    if (!authToken) {
        return null;
    }

    try {
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        return decodedToken;
    } catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
};