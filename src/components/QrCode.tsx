import React, { useState } from "react";
import { IoReload } from "react-icons/io5";
import { url } from "../server/url";

export const QrCode: React.FC = () => {
    const [qr, setQr] = useState(`${url}qr.png`)

    const reloadQr = () => {
        setQr(`${url}qr.png?t=${new Date().getTime()}`)
    }

    return (
        <div className="flex bg-gray-200 rounded-md overflow-hidden h-full">
            {/* QR y botón */}
            <div className="flex flex-col justify-center items-center gap-2 p-4 w-full">
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