import readXlsxFile from 'read-excel-file';
import { prepareClientsTransport } from '../helpers';
import toast from 'react-hot-toast';

interface Props {
	e: React.ChangeEvent<HTMLInputElement>;
}

export const getClientsTransport = async ({e}: Props) => {
    if (!e.target.files || e.target.files.length === 0) {
        toast.error(`No file selected.`, {
            position: 'top-right',
        });
        throw new Error("No file selected.");
    }

    const row = await readXlsxFile(e.target.files[0]);

    const EvaluarContent = () => {
        const titles = ["FECHA", "INICIO", "PROPIETARIO", "MASCOTA", "RAZA", "ASUNTO"];

        if (row[0][0] !== titles[0] ||
            row[0][1] !== titles[1] ||
            row[0][2] !== titles[2] ||
            row[0][3] !== titles[3] ||
            row[0][4] !== titles[4] ||
            row[0][5] !== titles[5]) {
            toast.error(`Error: La hoja de Excel no contiene la información requerida. (${titles})`, {
                position: 'top-right',
            });
            return [];
        } else if (row.length <= 1) {
            toast.error(`Error: La hoja de Excel no contiene información`, {
                position: 'top-right',
            });
            return [];
        } else {
            return prepareClientsTransport(row.slice(1));
        }
    }

    return EvaluarContent();
}