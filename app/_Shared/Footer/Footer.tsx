import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
<footer className="text-gray-700 py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

      {/* Logo & Description */}
      <div className="space-y-4">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-[#3252DF]">Stay</span>cation
        </Link>
        <p className="text-gray-500 text-sm">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam, natus!
        </p>
      </div>

      {/* Column 1 */}
      <div className="flex flex-col space-y-2">
        <h2 className="font-semibold text-gray-900">For Beginners</h2>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">New Account</Link>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">Start Booking</Link>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">Explore Rooms</Link>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col space-y-2">
        <h2 className="font-semibold text-gray-900">Explore</h2>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">Destinations</Link>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">Popular Hotels</Link>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">Reviews</Link>
      </div>

      {/* Column 3 */}
      <div className="flex flex-col space-y-2">
        <h2 className="font-semibold text-gray-900">Support</h2>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">Help Center</Link>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">Terms & Conditions</Link>
        <Link href="/" className="text-gray-600 hover:text-[#3252DF] text-sm">Privacy Policy</Link>
      </div>

    </div>

    {/* Bottom Footer */}
    <div className="mt-10 border-t border-gray-300 pt-6 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Staycation. All rights reserved.
    </div>
  </div>
</footer>

  )
}
