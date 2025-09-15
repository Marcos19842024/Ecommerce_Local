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