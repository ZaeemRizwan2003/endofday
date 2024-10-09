import Link from "next/link"
import React from "react"

const Footer = () => {
  return (

<footer className="bg-white shadow">
    <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-black sm:text-center dark:text-black">© 2024 <a href="/" className="hover:underline">EndofDay</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-black dark:text-black sm:mt-0">
        <li>
            <Link href="#" className="hover:underline me-4 md:me-6">About</Link>
        </li>
        <li>
            <Link href="#" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
        </li>
        <li>
            <Link href="#" className="hover:underline me-4 md:me-6">Blogs</Link>
        </li>
        <li>
            <Link href="#" className="hover:underline">Contact Us</Link>
        </li>
    </ul>
    </div>
</footer>

  )
}

export default Footer


