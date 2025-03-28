import { Json } from '../supabase/supabase';

export interface Target {
	target: string;
	type: string;
	kg: number;
	price: number;
}

export interface VariantProduct {
	id: string;
	target: string;
	type: string;
	kg: number;
	price: number;
	stock: number;
}

export interface Product {
	id: string;
	brand: string;
	name: string;
	images: string[];
	description: Json;
	created_at: string;
	variants: VariantProduct[];
}

export interface PreparedProducts {
	id: string;
	brand: string;
	name: string;
	price: number;
	images: string[];
	description: Json;
	created_at: string;
	targets: {
		target: string;
		type: string;
		kg: number;
		price: number;
	}[];
	variants: VariantProduct[];
}