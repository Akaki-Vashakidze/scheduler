

export class ApiException {
    keyword: string;
    error: any;
    description: string;
    location?: string;

    constructor(keyword: string, error?: any) {
        this.keyword = keyword;
        this.error = error;
    }





    public withDescription(description: string) {
        this.description = description;
        return this;
    }

    public withKeyword(keyword: string) {
        this.keyword = keyword;
        return this;
    }

    public withError(error: any) {
        this.error = error;
        return this;
    }

}
