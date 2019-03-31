import { JsonMap } from '@salesforce/ts-types';

export interface Attribute extends JsonMap {
    type: string;
    url: string;
}
