import Image from 'next/image'
import Link from "next/link"
import React from 'react'

const Footer = () => {
    return (
        <div className='mt-16 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between md:gap-0 bg-purple-950 p-8 rounded-lg'>
            <div className='flex flex-col items-center gap-4 md:items-start'>
                <Link href="/" className='flex items-center'>
                    <Image
                        src="/logo.png"
                        alt="INSTYLE"
                        width={36}
                        height={36}
                    />
                    <p className='hidden md:block text-md font-medium tracking-wider text-white'>INSTYLE</p>
                </Link>
                <p className='text-sm text-gray-400'>© 2025 INSTYLE</p>
                <p className='text-sm text-gray-400'>All rights reserved</p>
            </div>
            <div className='flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start'>
                <p className='text-sm text-amber-50'>Links</p>
                <Link href="/">Homepage</Link>
                <Link href="/">About</Link>
                <Link href="/">Contact</Link>
            </div>
            <div className='flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start'>
                <p className='text-sm text-amber-50'>Sales</p>
                <Link href="/">All Products</Link>
                <Link href="/">New Arrivals</Link>
                <Link href="/">Best Selllers</Link>
            </div>
            <div className='flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start'>
                <p className='text-sm text-amber-50'>Other</p>
                <Link href="/">Blog</Link>
                <Link href="/">Terms of Service</Link>
                <Link href="/">Privacy Policy</Link>
            </div>
        </div>
    )
}

export default Footer