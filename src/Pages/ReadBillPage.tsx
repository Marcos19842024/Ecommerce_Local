import { useState } from 'react';
import { RiBillLine } from 'react-icons/ri';
import { ReadBill } from '../components/readbill/ReadBill';

export const ReadBillPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [filePath, setFilePath] = useState<string>();
    const [info, setInfo] = useState<string | null>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                setFilePath(URL.createObjectURL(e.target.files[0]));
                setInfo(e.target.files[0].name);
            } else {
                setFile(null);
                e.target.value = "";
            }
        }
    }

    return (
        <div className="flex flex-col flex-1 w-full min-h-screen p-4">
            <div className="overflow-y-auto rounded-md bg-white p-2 shadow-md">
                <div className="flex items-center">
                    <input
                        type="file"
                        id="inputfile"
                        accept="application/pdf"
                        onChange={handleFile}
                        hidden
                    />
                    <label
                        htmlFor="inputfile"
                        className='bg-cyan-600 text-white flex items-center p-2 rounded-md gap-2 hover:bg-yellow-500 hover:scale-105 transition'
                    >
                        <RiBillLine /> Subir PDF
                    </label>
                </div>
            </div>
            
            {file && info && (
                <div className="grid grid-cols-1 md:grid-cols-3 w-full h-[80vh] border shadow rounded overflow-hidden">
                    <div className='col-span-1 border-r overflow-auto'>
                        <ReadBill file={file} info={info} />
                    </div>
                    <iframe
                        src={filePath}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        className='md:col-span-2'
                    />
                </div>
            )}
        </div>
    );
};