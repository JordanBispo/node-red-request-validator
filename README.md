# node-red-contrib-request-validator
A Node-RED custom node, to create schema for validate request fields


![image](https://img.shields.io/npm/v/node-red-contrib-request-validator?logo=npm&style=for-the-badge)
![image](https://img.shields.io/node/v/node-red-contrib-request-validator?logo=node.js&style=for-the-badge)
![image](https://img.shields.io/npm/l/node-red-contrib-request-validator?style=for-the-badge)

![image](https://img.shields.io/badge/Node--Red-8F0000?style=for-the-badge&logo=nodered&logoColor=white)
![image](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?style=for-the-badge)](https://www.paypal.com/donate/?hosted_button_id=FHSF5FES6S5UG)
## Requirements 
* node-red  version >=1.0.0

## Installation
#### Install via Node-RED Manage Palette
`node-red-contrib-request-validator`

#### Install via npm
```bash
$ cd ~/.node-red
$ npm install node-red-contrib-request-validator
# then restart node-red
```

## Usage

Create Schemas to validate request method, body and query parameters.
Schemas are configured in this node Properties. 

### Properties

- Method (GET, POST, PUT, DELETE) - the expected method of the request to be validated.

- Query Params (json) - the Schema of the expected query params.

- Body Params (json) - the Schema of the expected body params.

### Outputs

1. Valid Request (top output) 
    * `msg (any)` - the original msg of request.
2. Invalid Request (bottom output)
    * `payload (json)` - the error message.
    * `statusCode (400 | 500)` - the status code of error.


### Schema

#### Schema Params

1. `type (string | number | boolean | array | date | any)` - the type of the param.
1. `required (true | false)` - whether the param is required or not.
1. `subtype (string | number | boolean | date | any)` - if the type is array, the subtype of the array elements.

### Example

#### Body schema example

```json
    {
        "name": {
            "type": "string",
            "required": true
        },
        "addressList": {
            "type": "array",
            "subtype": "string"
        }
    }
```

1. Verify that the request body exist.
2. Verify if exist property `name` and its type is `string`.
3. If exist property `addressList` verify if its type is `array` and its subtype is `string`.
4. If all the validations are passed, send the original msg to the node connected to the top output.
5. If any validation fails, send the error message to the node connected to the bottom output.
