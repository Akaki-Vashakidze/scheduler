export enum ApiSortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface IApiSort {
    property: string;
    direction: ApiSortDirection;
}

export class ApiSort {
    public property: string;
    public direction: ApiSortDirection;

    constructor(data: IApiSort) {
        this.property = data.property;
        this.direction = data.direction;
    }

}
