import { Json } from '../supabase/supabase';

export interface VariantProduct {
	id: string;
	target: string;
	type: string;
	kg: number;
	price: number;
	stock: number;
}

export interface Targets {
	target: string;
	type: string;
	kg: number;
	price: number;
}

export interface Product {
	brand: string;
	name: string;
	id: string;
	description: Json;
	created_at: string;
	images: string[];
	variants: VariantProduct[];
}

export interface PreparedProducts {
	brand: string;
	name: string;
	id: string;
	description: Json;
	images: string[];
	price: number;
	targets: {
		target: string,
		type: string,
		kg: number,
	}[];
	variants: VariantProduct[];
}