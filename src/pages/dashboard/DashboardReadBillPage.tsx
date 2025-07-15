import { useState } from 'react';
import { RiBillLine } from 'react-icons/ri';
import { ReadBill } from '../../components/dashboard';

export const DashboardReadBillPage = () => {
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
            <div className="flex items-center justify-between">
                <h1 className='text-2xl font-bold'>Lector de Pdf</h1>
                <div className="flex items-center justify-between">
                    <input
                        type="file"
                        id="inputfile"
                        accept="application/pdf"
                        onChange={handleFile}
                        className="file-input file-input-bordered w-full max-w-xs"
                        hidden
                    />
                    <label
                        htmlFor="inputfile"
                        className='bg-cyan-600 text-white flex items-center m-2 p-2 rounded-md gap-2 hover:bg-yellow-500 hover:scale-105'>
                        <RiBillLine />Click To Upload Pdf
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-3 w-full h-[90vh] border shadow">
                {file && info && (
                    <>
                        <div className='col-span-1'>
                            <ReadBill file={file} info={info} />
                        </div>
                        <iframe
                            src={filePath}
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                            className='col-span-2'>
                        </iframe>
                    </>
                )}
            </div>
        </>
    );
};