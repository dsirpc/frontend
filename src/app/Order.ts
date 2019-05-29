export interface Order {
    table_number: string;
    dishes: string[];
    drinks: string[];
    dishes_ready: boolean[];
    chef: string;
    waiter: string;
    barman: string;
    status: number;
    timestamp: Date;
}
