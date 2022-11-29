export class ResBodySplicer {
    constructor() {
        this.data = {};
        this.message = null;
        this.status = null;
    }
    reqSuccess(data) {
        this.data = data;
        this.status = 0;
        this.message = "Success";
        return {"status": this.status, "message": this.message, "data": this.data};
    }
    reqFail(data, message) {
        this.status = -1;
        this.message = message;
        this.data = data;
        return {"status": this.status, "message": this.message, "data": this.data};
    }
}
