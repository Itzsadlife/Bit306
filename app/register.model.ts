export interface Merchant {
    _id: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    description: string;
    status: 'Pending' | 'Accepted' | 'Rejected'; 
    isFirstLogin: boolean;
}
