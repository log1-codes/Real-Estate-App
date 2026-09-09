export interface Property{
    id : string;
    title : string;
    description: string;
    price: number; 
    type  : string;
    bedrooms : number;
    bathrooms: number;
    area_sqft: number;
    address: string;
    city: string;
    latitude: string;
    longitude: string;
    images : string[],
    is_featured : boolean,
    is_sold: boolean,
    created_at: string
}