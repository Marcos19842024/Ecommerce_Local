import { Json } from '../supabase/supabase';

export interface Target {
	target: string;
	types: Type[];
}

export interface Type {
	type: string;
	kgs: Kg[];
}

export interface Kg {
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
	image: string;
	description: Json;
}

export interface Product {
	id: string;
	brand: string;
	name: string;
	created_at: string;
	variants: VariantProduct[];
}

export interface PreparedProducts {
	id: string;
	brand: string;
	name: string;
	created_at: string;
	targets: {
		target: string;
		types: Type[];
	}[];
	variants: VariantProduct[];
}