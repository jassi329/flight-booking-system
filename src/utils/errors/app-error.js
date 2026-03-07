class AppError extends error { 
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.explanation = message;
    }
}

module.exports = AppError;
