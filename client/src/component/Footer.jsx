import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='border-t'>
            <div className='container mx-auto p-1 text-center flex-col gap-2'>
                <p>© All Rights Reserved 2025</p>
            </div>
            <div className='flex items-center gap-4 justify-center text-2xl'>
                <a href='' className='hover:text-blue-600'>
                    <FaFacebookF />
                </a>
                <a href='' className='hover:text-blue-600'>
                    <FaInstagramSquare />
                </a>
                <a href='' className='hover:text-blue-600'>
                    <FaGithub />
                </a>
            </div>
        </footer>
    )
}

export default Footer
