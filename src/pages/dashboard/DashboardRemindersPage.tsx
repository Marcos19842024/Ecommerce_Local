import { useState } from "react";
import { Reminders } from "../../components/dashboard";
import { useClients } from "../../hooks";
import { Cliente } from "../../interfaces";

export const DashboardRemindersPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [info, setInfo] = useState<string | null>(null);
  const [showIb, setShowIb] = useState(true);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { data } = useClients({ e });
      if ((await data).length > 0) {
        setClientes(await data);
        setInfo(e.target.files[0].name);
        setShowIb(false);
      } else {
        setClientes([]);
        e.target.value = "";
      }
    }
  }

  return (
    <>
      {showIb ?
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Envío de mensajes</h1>
            <input
              type="file"
              id="inputfile"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFile}
              className="file-input file-input-bordered w-full max-w-xs"
              hidden
            />
            <label
              htmlFor="inputfile"
              className='bg-black text-white flex items-center self-end py-[6px] px-2 rounded-md text-sm gap-1 font-semibold hover:bg-cyan-600'>
              <span><i className="fa fa-cloud-upload fa-2x"></i></span>
              <p>Click To Upload List</p>
            </label>
          </div>
        </div> :
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Envío de mensajes</h1>
            {info && (
              <label>
                <span>
                  <i
                    className="fa fa-file-excel-o fa-1x"
                    style={{color:"green"}}>
                  </i>
                </span>
                <span
                  className="infolabel"
                  style={{width:"230px"}}>{`  ${info} (${clientes ? clientes.length : 0} Registros)`}
                </span>
              </label>
            )}
          </div>
        </div>
      }
      <div className="divider bg-gray-200 gap-5 my-5 h-full">
        <Reminders clientes={clientes} />
      </div>
    </>
  )
}