class ValidationError extends Error {

    /**
     * Creates a new ValidationError.
     * @class ValidationError
     * @param {Object.<string, string>} validation Maps keys to their errors while validating.
     */
    constructor(validation) {
        super(ValidationError.message);
        this.validation = validation;
        // We don't want to capture the Stack, no useful information there
        this.stack = "";
    }

    // Pretty print the error
    inspect(depth, opts) {

        let validationString = JSON.stringify(this.validation, null, ' ')
            // removes quotes from prop names
            .replace(/\"([^(\")"]+)\":/g,"$1:");

        // ident properly for final string
        const [first, ...rest] = validationString.split('\n');
        const formattedRest = rest.map(s => `  ${s}`);
        validationString = [first, ...formattedRest].join('\n');

        return `{ ${this.toString()}\n  validation: ${validationString}\n}`;
    }

    toString() {
        return `${this.constructor.name}: ${ValidationError.message}`;
    };
}

ValidationError.message = "Modern Validator encountered validation error(s).";

module.exports = ValidationError;