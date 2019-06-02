export interface Order {
    _id: string;
    table_number: number;
    food: string[];
    drinks: string[];
    food_ready: number;
    chef: string;
    waiter: string;
    barman: string;
    status: number;
    payed: boolean;
    timestamp: Date;
}
