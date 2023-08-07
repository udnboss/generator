# OpenAPI Generator

The following sample input can be used to generate an OpenAPI document. 

```
api:
  title: Invoicing API
  description: Invoicing API Reference
  version: '1.0'
  prefix: /api/v1
scripts:
  outputDir: ./output/invoicing
  framework: express #express|webapi|fastapi
interfaces:
  company:
    id: string
    name: string
    address: string
    crn: string
    trn: string
    contact: string
    mobile: string
    email: string

  category:
    id: string
    name: string
    items?: =item[]

  item:
    id: string
    name: string
    category_id?: string > category.id
    category?: =category
```

Some special syntax is used:

Example 1: `category_id?: string > category.id` means the `category_id` is optional property (due to ending with `?`), the data type is `string` and it is a reference `>` to another entity of type `category` and that its value is its `id` property. (think of it like a foreign key reference in a database table to another table).

Example 1: `items?: =item[]`: the `?` means it is not required, `=` means it is a reference to another entity of type `item` and `[]` means it is an array of items.


By saving it in a yaml file, and running the command to test it. A full example is located in `schemas/invoicing.yml`

Run this command to test it (generate just openapi document):
`python gen.py openapi ./schemas/invoicing.yml`

You can also just copy the sample output in `./output/invoicing.yml`.

The output will be stored in `./output/invoicing.yml`. You can copy the output and paste it in [Swagger Editor](https://editor.swagger.io/) to test it and validate.

To generate express api typescript code, run:
`python gen.py api ./schemas/invoicing.yml`

The output will be written in the specified outputDir in supplied `.yml` file.

The generated api will have the basic business, interfaces, classes, and routes. Backend can be JSON or Sqlite3 (default) for now.