import { SObject } from './sobject';

export interface QueryResult {
    totalSize: number;
    done: boolean;
    records: SObject[];
}
