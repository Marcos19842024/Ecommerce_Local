import { useState } from "react";
import { Reminders } from "../../components/dashboard";
import { Loader } from "../../components/shared/Loader";
import { useClients } from "../../hooks";
import { Cliente } from "../../interfaces";

export const DashboardRemindersPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>();
  const [info, setInfo] = useState<string | null>();
  const [showIb, setShowIb] = useState(true);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!clientes) return <Loader />;
    if (e.target.files) {
      const { data } = useClients({ e });
      if ((await data).length > 0) {
        setClientes(await data);
        setInfo(e.target.files[0].name);
        setShowIb(false);
      } else {
        setClientes(undefined);
        e.target.value = "";
      }
    }
  }

  return (
    <>
      {showIb ? (
        <div className='space-y-5'>
          <h1 className='text-2xl font-bold'>Envío de mensajes</h1>
          <div
            className="lista"
            id="divInput">
            <input
              type="file"
              id="inputfile"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              onChange={handleFile}
            />
            <label
              htmlFor="inputfile"
              className="uploadlabel">
              <span><i className="fa fa-cloud-upload fa-3x"></i></span>
              <p>Click To Upload List</p>
            </label>
          </div>
        </div>
      ) : (
        <>
          <div className="lista">
            {info && (
              <nav className="menuinfo">
                <section className="menuinfo__container">
                  <ul className="menuinfo__links">
                    <li className="menuinfo__item">
                      <label className="menuinfo__link">
                        <span>
                          <i
                            className="fa fa-file-excel-o fa-1x"
                            style={{color:"green"}}>
                          </i>
                        </span>
                        <span
                          className="infolabel"
                          style={{width:"230px"}}>{`${info} (${clientes?.length ?? 0} Registros)`}
                        </span>
                      </label>
                    </li>
                  </ul>
                </section>
              </nav>
            )}
          </div>
          <Reminders clientes={clientes ?? []} />
        </>
      )}
    </>
  );
};