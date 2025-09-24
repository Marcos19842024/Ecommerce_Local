export interface OrgNode {
  id?: string;
  name: string;
  attributes?: {
    alias?: string;
    puesto?: string;
    area?: string;
  };
  children?: OrgNode[];
}

export interface Employee {
  id: string;
  name: string;
  alias: string;
  puesto: string;
  area: string;
}

export interface NodeActionProps {
  modalAction?: string;
  modalEmployee?: Employee | null;
  onSuccess: any
}

export interface StaffRecruitmentProps {
  employee: Employee;
  onClose: () => void;
}

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

export interface ContractData {
  trabajador: string;
  estadoOrigen: string;
  curp: string;
  rfc: string;
  duracionContrato: string;
  salarioDiario: string;
  salarioSemanal: string;
  fechaContrato: string;
}