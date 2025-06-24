
import { ApiSort } from './ApiSort.class';

export enum ApiResponseType {
    SINGLE_OBJECT = 'SINGLE_OBJECT',
    PAGE = 'PAGE',
    ARRAY = 'ARRAY',
    COLLECTION = 'COLLECTION',
}

export class ApiResult<T> {
    type: ApiResponseType;
    data: T;
    page?: any;
    sort: ApiSort[];
}
