export interface ContactId {
    server: string
}

export interface ContactItem {
    number: string;
    name: string;
    isMyContact: boolean;
    id: ContactId;
}

export interface ContactResponse {
    statusText: ContactItem[];
}