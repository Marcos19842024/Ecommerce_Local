import { useState } from "react";
import { Transport } from "../../components/dashboard";
import { Fechas } from "../../interfaces";
import { useClientsTransport } from "../../hooks";

export const DashboardTransportPage = () => {
    const [fechas, setFechas] = useState<Fechas[]>([]);
    const [info, setInfo] = useState<string | null>(null);
    const [showIb, setShowIb] = useState(true);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const { data } = useClientsTransport({ e });
            if ((await data).length > 0) {
                setFechas(await data);
                setInfo(e.target.files[0].name);
                setShowIb(false);
            } else {
                setFechas([]);
                e.target.value = "";
            }
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className='text-2xl font-bold'>Lista de transportes</h1>
                {showIb ?
                    <div className="flex items-center justify-between">
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
                        className='bg-black text-white flex items-center m-1 self-end py-[6px] px-2 rounded-md text-sm gap-1 font-semibold hover:bg-cyan-600 hover:scale-105'>
                        <span><i className="fa fa-cloud-upload fa-2x"></i></span>
                        <p>Click To Upload List</p>
                    </label>
                    </div>
                :
                    <div className="flex w-fit items-center justify-between gap-1 text-cyan-600">
                        <i
                        className="fa fa-file-excel-o fa-1x"
                        style={{color:"green"}}>
                        </i>
                        <span
                            className='w-fit'>{`  ${info} (${fechas ? fechas.reduce((total,fecha) => {return total + fecha.clientes.length},0) : 0} Registros)`}
                        </span>
                    </div>
                }
            </div>
            <Transport fechas={fechas} />
        </>
    );
}