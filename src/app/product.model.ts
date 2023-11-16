export interface ProductType {
    _id: string;
    merchant_id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    reviews?: any[]; // Replace 'any' with your specific ReviewType if available
}
