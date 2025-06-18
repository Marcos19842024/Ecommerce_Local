import readXlsxFile from 'read-excel-file';
import { prepareClients } from '../helpers';
import { Cliente, Mascota, Recordatorio } from '../interfaces';
import toast from 'react-hot-toast';

interface Props {
	e: React.ChangeEvent<HTMLInputElement>;
}

export const getClients = async ({e}: Props) => {
    if (!e.target.files || e.target.files.length === 0) {
        throw new Error("No file selected.");
    }

    const row = await readXlsxFile(e.target.files[0]);

    const EvaluarContent = () => {
        const titles = ["CLIENTE","TELÉFONO 1","MASCOTA","TIPO DE RECORDATORIO","VACUNA","PRÓXIMA FECHA"];

        if (row[0][0] !== titles[0] ||
            row[0][1] !== titles[1] ||
            row[0][2] !== titles[2] ||
            row[0][3] !== titles[3] ||
            row[0][4] !== titles[4] ||
            row[0][5] !== titles[5]) {
            toast.error(`Error: La hoja de Excel no contiene la información requerida. (${titles})`, {
                position: 'bottom-right',
            });
            return [];
        } else if (row.length <= 1) {
            toast.error(`Error: La hoja de Excel no contiene información`, {
                position: 'bottom-right',
            });
            return [];
        } else {
            return ListPets(prepareClients(row.slice(1)));
        }
    }

    const ListPets = (clientes: Cliente[]) => {

        clientes.forEach(cliente => {
            const mascotas = cliente.mascotas;
        
            if (mascotas.length === 1) {
                cliente.mensaje = "su mascota '" + mascotas[0].nombre + "'," + ListReminders(mascotas[0]);
            } else {
                cliente.mensaje = "sus mascotas: '";
            
                for (let i = 0; i < mascotas.length; i++) {
                    if (i === 0) {
                        cliente.mensaje += mascotas[i].nombre + "'," + ListReminders(mascotas[i]);
                    } else {
                        if (i === (mascotas.length - 1)) {
                            cliente.mensaje += " y '" + mascotas[i].nombre + "'," + ListReminders(mascotas[i]);
                        } else {
                            cliente.mensaje += ", '" + mascotas[i].nombre + "'," + ListReminders(mascotas[i]);
                        }
                    }
                }
            }
            cliente.mensaje += " el día " + mascotas[0].recordatorios[0].tipos[0].fecha + ".";
        });
        return clientes;
    }
    
    const ListReminders = (mascotas: Mascota) => {

        let recordatorio = " tiene pendiente la aplicación de ";
        const recordatorios = mascotas.recordatorios;

        if (recordatorios.length === 1) {
            recordatorio += recordatorios[0].nombre + ListTypes(recordatorios[0]);
        } else {
            for (let i = 0; i < recordatorios.length; i++) {
                if (i === 0) {
                    recordatorio += recordatorios[i].nombre + ListTypes(recordatorios[i]);
                } else {
                    if (i === (recordatorios.length - 1)) {
                        recordatorio += " y " + recordatorios[i].nombre + ListTypes(recordatorios[i]);
                    } else {
                    recordatorio += ", " + recordatorios[i].nombre + ListTypes(recordatorios[i]);
                    }
                }
            }
        }
        return recordatorio;
    }

    const ListTypes = (recordatorios: Recordatorio) => {

        let tipo = '';
        const tipos = recordatorios.tipos;
    
        if (tipos.length === 1) {
            tipo += " (" + tipos[0].nombre + ")";
        } else {
            for (let i = 0; i < tipos.length; i++) {
                if (i === 0) {
                    tipo += " (" + tipos[i].nombre;
                } else {
                    if (i === (tipos.length - 1)) {
                        tipo += " y " + tipos[i].nombre + ")";
                    } else {
                        tipo += ", " + tipos[i].nombre;
                    }
                }
            }
        }
        return tipo;
    }

    return EvaluarContent();
}