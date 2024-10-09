// /pages/change-password.js

import ChangePassword from '@/Components/ChangePassword';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import RegisteredBakeries from '@/models/RBakerymodel';
import dbConnect from '@/middleware/mongoose';

const ChangePasswordPage = ({ isAuthenticated }) => {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/Restaurants/RLogin');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <p>Redirecting...</p>;
    }

    return (
        <div>
            <ChangePassword />
        </div>
    );
};

export async function getServerSideProps(context) {
    await dbConnect();

    const { req } = context;
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.authToken || null;

    if (!token) {
        return { props: { isAuthenticated: false } };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await RegisteredBakeries.findById(decoded.userId);
        if (!user) {
            return { props: { isAuthenticated: false } };
        }
        return { props: { isAuthenticated: true } };
    } catch (error) {
        return { props: { isAuthenticated: false } };
    }
}

export default ChangePasswordPage;
