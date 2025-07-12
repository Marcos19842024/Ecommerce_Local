//import { useState } from 'react';
//import { ExpenseReport } from '../../components/dashboard';
//import { RiBillLine } from 'react-icons/ri';

export const DashboardExpenseReportPage = () => {
  /* const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files?.[0]) {
        setFile(e.target.files[0]);
        setInfo(e.target.files[0].name);
      } else {
        setFile(null);
        e.target.value = "";
      }
    }
  } */

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className='text-2xl font-bold'>Reporte de gastos</h1>
        {/* <div className="flex items-center justify-between">
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
        </div> */}
      </div>
      {/* {file && info && <ExpenseReport file={file} info={info} />} */}
    </>
  );
};