import React from 'react';
import Navbar from '@/Components/HomeNavbar';
import Link from 'next/link';

const Signup = () => {
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center bg-gray-100 mt-20">
                <div className="flex w-full max-w-5xl h-[80vh] gap-6 px-4">
                    
                    {/* Signup as Customer */}
                    <Link href="/Customer/Signup">
                        <div className="group relative p-8 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 flex flex-col justify-center items-center cursor-pointer w-full h-full overflow-hidden">
                            <img src="/customer.jpg" alt="Customer" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <h2 className="text-xl font-bold text-white relative z-10">Signup as Customer</h2>
                        </div>
                    </Link>

                    {/* Signup as Bakery Owner */}
                    <Link href="/Restaurants/Signup">
                        <div className="group relative p-8 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 flex flex-col justify-center items-center cursor-pointer w-full h-full overflow-hidden">
                            <img src="/restaurant.jpg" alt="Bakery Owner" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <h2 className="text-xl font-bold text-white relative z-10">Signup as Bakery Owner</h2>
                        </div>
                    </Link>

                    {/* Signup as Rider */}
                    <Link href="/Delivery/deliverypartner">
                        <div className="group relative p-8 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 flex flex-col justify-center items-center cursor-pointer w-full h-full overflow-hidden">
                            <img src="/rider.jpg" alt="Rider" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <h2 className="text-xl font-bold text-white relative z-10">Signup as Rider</h2>
                        </div>
                    </Link>

                </div>
            </div>
        </>
    );
};

export default Signup;
