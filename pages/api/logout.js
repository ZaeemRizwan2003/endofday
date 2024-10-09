import cookie from 'cookie';

export default function handler(req, res) {

    const authTokenCookie = cookie.serialize('authToken', '', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'strict',
        path: '/'
    });

    const userIdCookie = cookie.serialize('userId', '', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'strict',
        path: '/'
    });

    res.setHeader('Set-Cookie', [authTokenCookie, userIdCookie]);

    res.status(200).json({ message: 'Logout successful' });

    // res.setHeader('Set-Cookie', 'authToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict');
    // res.setHeader('Set-Cookie', 'userId=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict');

    // res.status(200).json({ message: 'Logout successful' });
}
