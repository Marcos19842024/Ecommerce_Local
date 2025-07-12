import React, { useState } from "react";
import { IoReload } from "react-icons/io5";

export const Shellinabox: React.FC = () => {
    const [qr, setQr] = useState('http://veterinariabaalak.com/qr.png')

    const reloadQr = () => {
        setQr(`http://veterinariabaalak.com/qr.png?t=${new Date().getTime()}`)
    }
    return (
        <div className='flex bg-gray-200 rounded-md'>
            <iframe
                className='w-full h-96 rounded-md p-2 gap-2'
                src='https://veterinariabaalak.com:3002'
                title='Shellinabox'
                style={{ border: 'none', overflow: 'hidden' }}
                allowFullScreen={true}
                allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
            />
            <div className='flex flex-col justify-center items-center gap-2 p-2'>
                <img
                    className='bg-cyan-600 p-3 w-96 h-64 rounded-md'
                    src={qr}
                    alt='Qr Code'>
                </img>
                <button
                    className='flex justify-between items-center gap-1 py-2 w-fit text-white rounded-md p-2 transition-all group bg-cyan-600 hover:bg-yellow-500 hover:scale-105'
                    type="button"
                    onClick={reloadQr}>
                    <IoReload className='font-medium text-sm'/>Reload
                </button>
            </div>
        </div>
    );
}