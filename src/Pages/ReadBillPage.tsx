import { useState } from 'react';
import { RiBillLine } from 'react-icons/ri';
import { ReadBill } from '../components/ReadBill';

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
        <>
            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <h1 className='text-2xl font-bold'>Lector de PDF</h1>
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
                            className='bg-cyan-600 text-white flex items-center m-2 px-4 py-2 rounded-md gap-2 hover:bg-yellow-500 hover:scale-105 transition'
                        >
                            <RiBillLine /> Subir PDF
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 w-full h-[80vh] border shadow rounded overflow-hidden">
                    {file && info && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </>
    );
};