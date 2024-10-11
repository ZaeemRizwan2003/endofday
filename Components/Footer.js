import Link from "next/link";
import React from "react";
import { FaInstagram } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-white shadow">
      <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col items-center justify-center md:flex-row md:justify-between">
        <span className="text-sm text-black sm:text-center dark:text-black mb-3 md:mb-0">
          © 2024 <a href="/" className="hover:underline">EndofDay</a>. All Rights Reserved.
        </span>
        <div className="flex space-x-4">
          <FaInstagram className="text-2xl text-black hover:text-purple-700" />
          <Link href="https://mail.google.com/mail/?view=cm&fs=1&to=endofday112233@gmail.com" target="_blank">
            <MdOutlineEmail className="text-2xl text-black hover:text-purple-700 cursor-pointer" />
          </Link>
          <FaTwitter className="text-2xl text-black hover:text-purple-700" />
        </div>
        <ul className="flex flex-wrap justify-center items-center text-sm font-medium text-black dark:text-black">
          <li>
            <Link href="/about" className="hover:underline mx-2 md:mx-4">About</Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:underline mx-2 md:mx-4">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline mx-2 md:mx-4">Blogs</Link>
          </li>
          <li>
            <Link href="/CustomerSupport/FAQ" className="hover:underline mx-2 md:mx-4">Customer Support</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

