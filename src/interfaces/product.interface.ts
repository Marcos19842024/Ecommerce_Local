import { JSONContent } from '@tiptap/react';
import { Json } from '../supabase/supabase';

export interface Target {
	target: string;
	type: string;
	kg: number;
	price: number;
}

export interface VariantProduct {
	id: string;
	stock: number;
	price: number;
	target: string;
	type: string;
	kg: number;
}

export interface Product {
	id: string;
	name: string;
	brand: string;
	slug: string;
	description: Json;
	images: string[];
	created_at: string;
	variants: VariantProduct[];
}

export interface PreparedProducts {
	id: string;
	name: string;
	brand: string;
	slug: string;
	description: Json;
	images: string[];
	created_at: string;
	price: number;
	targets: {
		target: string;
	}[];
	variants: VariantProduct[];
}

export interface ProductInput {
	name: string;
	brand: string;
	slug: string;
	description: JSONContent;
	images: File[];
	variants: VariantInput[];
}

export interface VariantInput {
	id?: string;
	stock: number;
	price: number;
	target: string;
	type: string;
	kg: number;
}