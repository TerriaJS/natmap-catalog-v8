# V8 National Map Catalog !

## How to build

```
node .\natmap\build.js
```

Catalog will be saved to `./out.json`

## To update catalog

1. If needed, run `catalog-converter` on nationalmap/aremi catalog to get latest conversion. See logs for which command to run:
   - https://github.com/TerriaJS/natmap-catalog-v8/blob/18e736cd4084284078cb6dc4f073acc8b7ce3cee/natmap/in/natmap-convert-log.txt
   - https://github.com/TerriaJS/natmap-catalog-v8/blob/18e736cd4084284078cb6dc4f073acc8b7ce3cee/natmap/in/aremi-convert-log.txt
2. Copy input (v7) and output (v8) to `natmap\in` and rename to match naming patterns:

- `natmap\in\natmap-2020-09-03.json`
- `natmap\in\natmap-2020-09-03-v8.json`

3. Update dependencies in `root.js`

https://github.com/TerriaJS/natmap-catalog-v8/blob/53e9aed5c80bd23ea7086ab2138b3c0f25d21497/natmap/root.js#L7-L8

4. Run `node .\natmap\build.js`

### Add new datasets from GA

`National Datasets` are added 9 datasets as described by `catalog` in file `./natmap/in/manual-v8-catalogs/ga-new-layers-v8.json`. You can directly drag-and-drop this
json file to the NationalMap to verify if they work correctly. Each member in the `catalog` array has a property `catalogPath` that tells `root.js` where to add this
member.

### Generate a complete catalog json file

Run

```
  cd natmap
  node build.js
```

which will produce catalog file `natmap/out.json`. Please upload this file to the `s3` bucket with different name to be used by national map config.

**Catalogue history (in S3)**
| _s3 file name_ | _commit version_ |
|----------------|------------------|
| natmap-2021-02-10-v8.json | 9c1194b45b7e77df7e40efd9aae94e86a97e95f6 |
| natmap-2021-03-30-v8.json | 92f0b1744aa77eb8be9e894a775f27fabc98f873 |
| natmap-2021-04-13-v8.json | 5a5e99f5acc92907381dbcdd256e5a0490225f59 |
| natmap-2021-04-14-v8.json | 128bf155564c009ff091b84efd8445271e1e8289 |
| natmap-2021-04-16-v8.json | 3bd209bebcf2446715ea131ed4e52a5faf825dc5 |
| natmap-2021-04-16-v8.json | 3bd209bebcf2446715ea131ed4e52a5faf825dc5 |
| natmap-2021-05-12-v8.json | d9b4efd2c28ca4135b9a6dccad9ac52e7eb6d1b5 |

**Catalogue history (in GitHub)**
| _catalog commit_ | _this repo commit_ |
|----------------|------------------|
| https://github.com/TerriaJS/saas-catalogs-public/commit/facb398ba31cf9b68ccfb92a227a566b6592555f | https://github.com/TerriaJS/natmap-catalog-v8/commit/061b2cbcbebd1fae24cfda0cf60f5886a57b0cda |

## Deploy

**UPDATE** catalogs are now stored in https://github.com/TerriaJS/saas-catalogs-public/tree/main/nationalmap:

- https://raw.githubusercontent.com/TerriaJS/saas-catalogs-public/main/nationalmap/dev.json
- https://raw.githubusercontent.com/TerriaJS/saas-catalogs-public/main/nationalmap/test.json
- https://raw.githubusercontent.com/TerriaJS/saas-catalogs-public/main/nationalmap/prod.json

To deploy:

1.  Update files in https://github.com/TerriaJS/saas-catalogs-public/tree/main/nationalmap
2.  Update URL in `initializationUrls` in SaaS `map-config`
    - **Dev:** https://dev.saas.terria.io/record-editor/map-config-nationalmap
    - **Test:** https://test.saas.terria.io/record-editor/map-config-nationalmap
    - **Prod:** https://saas.terria.io/record-editor/map-config-nationalmap
3.  Manually update map-config.json files in https://github.com/TerriaJS/saas-catalogs-public
