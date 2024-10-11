import Navbar from '@/Components/HomeNavbar';
import Link from 'next/link';
import React from 'react';

const PrivacyPolicy = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white text-gray-900 py-16">
                <div className="container mx-auto max-w-4xl px-6 md:px-12">
                    <div className="bg-white shadow-xl rounded-lg p-10">
                        <h1 className="text-3xl font-bold text-purple-700 mb-10 text-center">Privacy Policy</h1>

                        <p className="text-lg text-gray-600 leading-relaxed mb-8 text-center">
                            At EndOfDay, your privacy is important to us. This document outlines how we collect, use, and protect your data when using our services.
                        </p>

                        {/* <section className="mb-12">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">1. Introduction</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to EndOfDay! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please take the time to read through this policy carefully.
            </p>
          </section> */}

                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-purple-700 mb-6">1. Information We Collect</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                We collect personal information that you provide, such as your name, email address, and phone number, along with non-personal information such as your browser type and IP address for analytics and improving user experience.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-purple-700 mb-6">2. How We Use Your Information</h2>
                            <ul className="list-inside list-disc text-lg text-gray-700 leading-relaxed space-y-3">
                                <li>To provide and maintain our services effectively.</li>
                                <li>To improve your user experience with personalized content.</li>
                                <li>To communicate with you regarding updates or issues.</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-purple-700 mb-6">3. Sharing Your Information</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                We only share your personal data with third parties when required by law or to protect the rights and integrity of our services.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-semibold text-purple-700 mb-6">4. Data Security</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Your data is protected with reasonable technical and organizational measures to prevent unauthorized access or misuse.
                            </p>
                        </section>

                        <section className="mb-12">

                            <Link href='/CustomerSupport/Contact'><h2 className="text-2xl font-semibold text-purple-700 mb-6 underline">5. Contact Us</h2></Link>

                            <p className="text-lg text-gray-700 leading-relaxed">
                                If you have any questions or concerns about our Privacy Policy, feel free to reach out at <a href="mailto:endofday112233@gmail.com" className="text-purple-700 underline">privacy@endofday.com</a>.
                            </p>
                        </section>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                This policy was last updated on October 11, 2024.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;