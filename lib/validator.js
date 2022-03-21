
Date.prototype.isValid = function () {
    return this.getTime() === this.getTime()
}

Number.prototype.isInteger = function () {
    return /^\d+$/.test(this)
}

Number.prototype.isBetween = function (min, max) {
    return this >= min && this <= max
}

Number.prototype.isFloat = function () {
    return /^\d+(\.\d+)*$/.test(this)
}

String.prototype.isNumber = function () {
    return /^\d+$/.test(this)
}

String.prototype.isFloatNumber = function () {
    return /^\d+(\.\d+)*$/.test(this)
}


String.prototype.isPhoneNumber = function () {
    return /\(?\+[0-9]{1,3 }\)??-?[0-9]{1,3 }?-?[0-9]{3,5}?-?[0-9]{4}(?-?[0-9]{3})??(\w{1,10}\s?\d{1,6})?/.test(this);
}

String.prototype.isValidCpf = function () {
    return /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(this);
}

String.prototype.isValidCnpj = function () {
    return /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(this);
}

String.prototype.isEmail = function () {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this);
}

String.prototype.isBoolean = function () {
    return /^(true|false)$/.test(this);
}

String.prototype.isDate = function () {
    return /^\d{4}-\d{2}-\d{2}$/.test(this) ||
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(this) ||
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(this);
}

String.prototype.validateByRegex = function (regex) {
    return regex.test(this);
}

const validateQueryString = (queryString, expectedType, specifications = {}) => {

    if (expectedType === 'number') {
        expectedType = specifications?.float ? 'float' : 'integer'
    }
    return validateStringByFormat(queryString, specifications?.format, specifications?.max, specifications?.min)

}

const validateNumber = (inputValue, max, min, float = false) => {

    if (float) {
        return inputValue.isFloatNumber() && inputValue.isBetween(min, max)
    } else {
        return inputValue.isInteger() && inputValue.isBetween(min, max)
    }

}

const validateStringByFormat = (inputValue, format, max, min) => {

    if (inputValue.length < min || inputValue.length > max) return false

    switch (format) {
        case 'phone':
            return inputValue.isPhoneNumber();

        case 'cpf':
            return inputValue.isValidCpf();

        case 'cnpj':
            return inputValue.isValidCnpj();

        case 'email':
            return inputValue.isEmail();

        case 'boolean':
            return inputValue.isBoolean();

        case 'date':
            return inputValue.isDate();

        case 'integer':
            return inputValue.isNumber();

        case 'float':
            return inputValue.isFloatNumber();

        default:
            return true;
    }
}

const isValidDate = (inputDate) => {

    try {

        const date = new Date(inputDate)
        return date.isValid()

    } catch (error) {
        return false
    }
}


const validateArrayItems = (array, expectedType) => {

    for (let [i, item] of array.entries()) {

        if (!validateItem(item, expectedType)) return false

        if (i === array.length - 1) return true

    }

}

const arrayValidate = (inputArray, arraySchema = 'any') => {

    if (!Array.isArray(inputArray))
        return false

    if (inputArray?.length < 1)
        return true

    if (arraySchema === 'any')
        return true

    return validateArrayItems(inputArray, arraySchema)

}

const validateItem = (inputValue, expectedType, subtype = 'any', specifications = {}) => {

    switch (expectedType) {
        case 'boolean':
            return inputValue === true || inputValue === false

        case 'date':
            return isValidDate(inputValue)

        case 'number':
            return validateNumber(
                inputValue,
                specifications?.max || inputValue,
                specifications?.min || inputValue,
                specifications?.float || false
            )

        case 'string':
            if (typeof inputValue !== 'string') return false
            return validateStringByFormat(
                inputValue,
                specifications?.format,
                specifications?.max || inputValue.length,
                specifications?.min || inputValue.length
            )

        case 'array':
            return arrayValidate(inputValue, subtype, specifications)

        default:
            return true
    }

}


const BodyValidator = (body, schema) => {

    const schemaKeys = Object.keys(schema)
    if (schemaKeys.length < 1) return false

    for (let key of schemaKeys) {
        if (body.hasOwnProperty(key)) {

            const request_body = body[key]
            const expected_type = schema[key]?.type || 'any'
            const subtype = schema[key]?.subtype || 'any'
            const specifications = schema[key]?.specifications || {}

            const invalid_message = `'${key}' must be a ${expected_type} ${!!subtype ? `of ${subtype}s` : ''
                }, ${!!specifications?.format ? `with format ${specifications?.format},` : ''} in request body`


            if (!validateItem(request_body, expected_type, subtype, specifications)) {
                return invalid_message
            }

        } else if (!!schema[key].required) {
            return `'${key}' are required in request body`
        }
    }
    return false
}

const QueryValidator = (query, schema) => {

    const schemaKeys = Object.keys(schema)
    if (schemaKeys.length < 1) return false

    for (let key of schemaKeys) {

        if (query.hasOwnProperty(key)) {

            const query_string = query[key] + ''
            const expected_type = schema[key]?.type || 'any'
            const specifications = schema[key]?.specifications || {}

            if (!validateQueryString(query_string, expected_type, specifications)) {
                return `'${key}' must be a ${schema[key].type} in query`
            }

        } else if (!!schema[key].required) {
            return `'${key}' are required in request query`
        }

    }
    return false
}

module.exports = {
    BodyValidator,
    QueryValidator
}


