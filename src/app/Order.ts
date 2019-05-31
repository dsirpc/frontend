export interface Order {
    _id: string;
    table_number: number;
    dishes: string[];
    drinks: string[];
    dishes_ready: number;
    chef: string;
    waiter: string;
    barman: string;
    status: number;
    timestamp: Date;
}
