String.prototype.toBoolean = function () {
    return this === 'true';
}

Number.prototype.toBoolean = function () {
    return !!this;
}

Boolean.prototype.toBoolean = function () {
    return this;
}

String.prototype.asString = function () {
    return this;
}

String.prototype.toNumber = function () {
    return Number(this);
}

Boolean.prototype.toNumber = function () {
    return Number(this);
}

Number.prototype.toNumber = function () {
    return this;
}

String.prototype.toDate = function () {
    return new Date(this);
}

Boolean.prototype.toDate = function () {
    return new Date(this);
}

sanitizeItem = (item, expectedType, subtype) => {
    switch (expectedType) {
        case 'string':
            return item.toString();
        case 'number':
            return item.toNumber();
        case 'boolean':
            return item.toBoolean();
        case 'array':
            return item.map((i) => sanitizeItem(i, subtype));
        case 'date':
            return item.toDate();
        case 'any':
            return item;
        default:
            throw IllegalArgumentException(`Invalid expectedType: ${expectedType}`);
    }
};

const BodySanitizer = (body, schema) => {
    const schemaKeys = Object.keys(schema)
    for (let key of schemaKeys) {
        if (body.hasOwnProperty(key)) {
            const item = body[key]
            const expected_type = schema[key]?.type || 'any'
            const subtype = schema[key]?.subtype || 'any'

            body[key] = sanitizeItem(item, expected_type, subtype)
        }
    }
    return body
}

module.exports = {
    BodySanitizer
};