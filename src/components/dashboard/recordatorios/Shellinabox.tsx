import React, { useState } from "react";
import { IoReload } from "react-icons/io5";
import { url } from "../../../server/url";

export const Shellinabox: React.FC = () => {
    const [qr, setQr] = useState(`${url}/qr.png`)

    const reloadQr = () => {
        setQr(`${url}/qr.png?t=${new Date().getTime()}`)
    }

    return (
        <div className="flex flex-col lg:flex-row bg-gray-200 rounded-md overflow-hidden h-full">
            {/* Iframe Shellinabox - ahora ocupa todo el espacio restante */}
            <iframe
                className="flex-1 w-full p-2"
                src={`${url}:3002`}
                title="Shellinabox"
                style={{ border: 'none', overflow: 'hidden' }}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />

            {/* QR y botón */}
            <div className="flex flex-col justify-center items-center gap-4 p-4 w-full lg:w-1/2">
                <img
                    className="bg-cyan-600 p-1 w-full max-w-xs object-contain rounded-md"
                    src={qr}
                    alt="Qr Code"
                />
                <button
                    className="flex items-center gap-2 text-white rounded-md px-4 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
                    type="button"
                    onClick={reloadQr}
                >
                    <IoReload className="text-lg" />
                    Reload
                </button>
            </div>
        </div>
    );
}