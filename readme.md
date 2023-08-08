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
    id: 
    name: 
    address: 
    crn: 
    trn: 
    contact: 
    mobile: 
    email: str|email

  category:
    id: string
    name: string
    items?: item[]

  item:
    id: string
    name: string
    category_id?: str > category.id
    category?: =category
```

Some special syntax is used:

Example 1: `email: str|email` means the property `email` has a data type `string` and the format is `email`.

Example 2: `category_id?: str > category.id` means the `category_id` is optional property (due to ending with `?`), the data type is `string` and it is a reference `>` to another entity of type `category` and that its value is its `id` property. (think of it like a foreign key reference in a database table to another table).

Example 3: `items?: item[]`: the `?` means it is not required, `item` means it is a reference to another known entity of type `item` and `[]` means it is an array of items.


You can start by saving input in a yaml file, and running the commands to test it. A full input example is located in `schemas/invoicing.yml`

Run this command to test it (generate just OpenAPI document):
`python gen.py docs ./schemas/invoicing.yml`

You can view a sample output in `./output/invoicing.yml`.

The output will be stored in `./output/invoicing.yml`. You can copy the output and paste it in [Swagger Editor](https://editor.swagger.io/) to test it and validate.

Example to generate expressJs api typescript code, (code will be generated for the specified framework in `scripts.framework`), run:
`python gen.py api ./schemas/invoicing.yml`

The output will be written in the specified `scripts.outputDir` in the supplied `.yml` file.

The generated api will have the basic business, interfaces, classes, and routes. Backend can be JSON or Sqlite3 (default) for now.

Upcoming is to generate sql for :sqlite, postgres, sql server, etc.