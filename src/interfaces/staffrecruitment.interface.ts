export interface PersonalFormData {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    domicilio: {
        calle: string;
        numero: string;
        colonia: string;
        cp: string;
        ciudad: string;
        estado: string;
    };
    datosPersonales: {
        celular: string;
        rfc: string;
        fechaNacimiento: string;
        curp: string;
        ciudadNacimiento: string;
        estadoNacimiento: string;
        numeroIMSS: string;
        fechaIngreso: string;
    };
    datosFamiliares: {
        nombreConyuge: string;
        colonia: string;
        cp: string;
        ciudad: string;
        estado: string;
    };
    datosEmergencia: {
        persona1: {
            nombre: string;
            celular: string;
            parentesco: string;
        };
        persona2: {
            nombre: string;
            celular: string;
            parentesco: string;
        };
    };
}