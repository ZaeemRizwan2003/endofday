import { useState } from 'react';
import Navbar from '@/Components/HomeNavbar';
const FAQ = () => {
    const faqs = [
        {
            question: "How can I get endofday delivery?",
            answer: "To get endofday delivery, simply locate the restaurants and shops near you by typing in your address, browse through a variety of restaurants and cuisines, check menus and prices, choose your dishes and add them to the basket. Now you only need to checkout and make the payment. Soon your delicious food will arrive at your doorstep!",
        },
        {
            question: "Which takeout restaurants open now near me?",
            answer: "You can check which takeout restaurants are open now near you by simply typing your address in the location bar on endofday and pressing search. You will see all the available restaurants and shops that deliver to your area.",
        },
        {
            question: "Does endofday deliver 24 hours?",
            answer: "Yes, endofday in Pakistan delivers 24 hours. However, many restaurants may be unavailable for a late-night delivery. Please check which places in Pakistan deliver to you within 24 hours by using your address.",
        },
        {
            question: "Can you pay cash for endofday?",
            answer: "Yes, you can pay cash on delivery for endofday in Pakistan.",
        },
        {
            question: "How can I pay endofday online?",
            answer: "You can pay online while ordering at endofday Pakistan by using Jazzcash/Easypaisa",
        },
        {
            question: "How much does endofday charge for delivery?",
            answer: "Delivery fee charged by endofday in Pakistan depends on many operational factors, most of all - location and the restaurant you are ordering from. You can always check the delivery fee while forming your order. Besides, you can filter the restaurants by clicking on the 'Free Delivery' icon at the top of your restaurant listing.",
        },
        {
            question: "What restaurants let you order online?",
            answer: "There are hundreds of restaurants on endofday Pakistan that let you order online. For example, KFC, McDonald's, Pizza Hut, OPTP, Hardee's, Domino's, Kababjees and many-many more! In order to check all the restaurants near you that deliver, just type in your address and discover all the available places.",
        },
        {
            question: "Does endofday have minimum order?",
            answer: "Yes, many restaurants have a minimum order. The minimum order value depends on the restaurant you order from and is indicated during your ordering process.",
        },
        {
            question: "What is the difference between delivery and Pick-Up?",
            answer: "If you choose delivery, a endofday rider will collect your order from the restaurant and take it to your chosen delivery address. If you choose Pick-Up, you can takeaway your food directly from the restaurant for extra savings – and to jump to the front of the queue. Pick-Up orders are available for restaurants only.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Navbar />
            <div className=" mt-24 mb-10 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                            <button
                                onClick={() => toggleAnswer(index)}
                                className="flex justify-between items-center w-full p-4 text-left text-purple-700 font-semibold hover:bg-purple-100 focus:outline-none transition duration-200"
                            >
                                {faq.question}
                                <span className="ml-2">
                                    {openIndex === index ? '-' : '+'}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="p-4 border-t border-gray-200 text-gray-600 bg-purple-50">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FAQ;
