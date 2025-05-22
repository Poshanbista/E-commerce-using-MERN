import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";

const ConfirmBox = ({ cancel, confirm, close }) => {
    return (
        <div className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800/90 flex p-4 items-center justify-center '>
            <div className='bg-white max-w-3xl w-120 rounded p-4 mb-80'>
                <div className='flex justify-between items-center gap-3'>
                    <h1 className='font-bold'>Permanent Delete</h1>
                    <button onClick={close} className='hover:bg-red-400'>
                        <IoMdCloseCircle size={30} />
                    </button>
                </div>
                <p className='my-4'>Are you sure Permanent Delete</p>
                <div className='w-fit ml-auto flex items-center gap-4'>
                    <button onClick={cancel} className='px-5 py-1 border rounded hover:bg-red-600 hover:text-white'>Cancel</button>
                    <button onClick={confirm} className='px-5 py-1 border rounded hover:bg-green-600 hover:text-white'>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmBox
