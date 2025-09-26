import { ReactNode } from "react";

export interface FileWithPreview {
  [x: string]: any;
  id: string
  name: string;
  url: string;
  type: string;
  size?: string;
  icon: string;
  color: string;
  uploadDate?: string;
}

export interface Modal {
  children: ReactNode;
  className1?: string;
  className2?: string;
  closeModal: () => void;
}

export interface Password {
  onSuccess: () => void;
  message?: string;
}