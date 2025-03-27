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
	description: Json;
}

export interface Product {
	id: string;
	brand: string;
	name: string;
	images: string[];
	created_at: string;
	variants: VariantProduct[];
}

export interface PreparedProducts {
	id: string;
	brand: string;
	name: string;
	images: string[];
	created_at: string;
	target: {
		target: string;
		types: string;
		kg: number;
		price: number;
	}[];
	variants: VariantProduct[];
}