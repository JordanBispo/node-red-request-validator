'use strict'
const SIMPLE_VALIDATE_TYPES = ['number', 'string', 'boolean']

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};

String.prototype.isNumber = function () {
    return /^\d+$/.test(this);
}

String.prototype.isBoolean = function () {
    return /^(true|false)$/.test(this);
}

String.prototype.isDate = function () {
    return /^\d{4}-\d{2}-\d{2}$/.test(this) ||
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(this) ||
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(this);
}

const validateQueryString = (queryString, expectedType) => {

    switch (expectedType) {
        case 'number':
            return queryString.isNumber();
        case 'boolean':
            return queryString.isBoolean();
        case 'date':
            return queryString.isDate();
        default:
            return true;
    }

}

const simpleValidate = (inputValue, expectedType) => {
    return typeof inputValue === expectedType
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

        if (SIMPLE_VALIDATE_TYPES.includes(expectedType) && !simpleValidate(item, expectedType))
            return false

        if (expectedType === 'date' && !isValidDate(item))
            return false


        if (i === array.length - 1)
            return true

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

const validateItem = (inputValue, expectedType, subtype = 'any') => {

    if (SIMPLE_VALIDATE_TYPES.includes(expectedType))
        return simpleValidate(inputValue, expectedType)

    if (expectedType === 'date') {
        return isValidDate(inputValue)
    }

    if (expectedType.includes("array"))
        return arrayValidate(inputValue, subtype)

}


const BodyValidator = (body, schema) => {

    const schemaKeys = Object.keys(schema)
    if (schemaKeys.length < 1) return false

    for (let key of schemaKeys) {
        if (body.hasOwnProperty(key)) {

            if (validateItem(body[key], schema[key].type, schema[key].subtype)) {
                return `${key} must be a ${schema[key].type} ${schema[key].subtype ? 'of ' + schema[key].subtype : ''}`
            }

        } else if (!!schema[key].required) {
            return `${key} are required in request body`
        }
    }
    return false
}

const QueryValidator = (query, schema) => {

    const schemaKeys = Object.keys(schema)
    if (schemaKeys.length < 1) return false

    for (let key of schemaKeys) {
        if (query.hasOwnProperty(key)) {

            if (validateQueryString(query[key] + '', schema[key].type)) {
                return `${key} must be a ${schema[key].type}`
            }

        } else if (!!schema[key].required) {
            return `${key} are required in request query`
        }
    }
    return false
}



module.exports = {
    BodyValidator,
    QueryValidator
}


