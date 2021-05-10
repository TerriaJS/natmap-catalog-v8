***Branch Note***
This branch will build a customised static catalog for Vic DT. Do not merge this branch to the main.

1. After building an updated catalog, rename the output `./natmap/out.json` to something meaningful, e.g., `./natmap/national-energy-water-satellite-vic-reorganised-v8-2021-03-31.json`, then upload it to `https://s3.console.aws.amazon.com/s3/buckets/tiles.terria.io?region=ap-southeast-2&prefix=static/victoria-digitaltwin/`.<br><br>

2. Record the history in the following table.
    ***Vic DT Catalog History***
    | *s3 file name* | *commit version* | *note* |
    |----------------|------------------|------------------|
    | national-energy-water-satellite-vic-reorganised-v8-2021-03-31.json | 63d897408a656baf4af3b2f2d6e7902688449ef7 | Initial auto built catalog |
    | national-energy-water-satellite-vic-reorganised-v8-2021-03-31b.json | b0d4bdab0ad8410a256928f23b6f1fea079d311e | Fix group structure for local government datasets. |
    | national-energy-water-satellite-vic-reorganised-v8-2021-04-01.json | 4f213cc855e848b81375ec746c022d04a34171dc | Filter out group "Western Australia" in Energy group.|
    | national-energy-water-satellite-vic-reorganised-v8-2021-04-08.json | 53bd358903e848a2cf04a8a3823dd89f9141cbf8 | Filter out datasets that require api.transport.nsw.gov.au access credentials. |
    | national-vic-reorganised-v8-2021-05-07.json | 385130860d29e4875d18259526e3853ab3fce81d | Merged from main and add some environment data. |
    | `<new catalog file name>` | `<commit version>` | `<new note>` |

--------------
# V8 National Map Catalog !

## How to build

```
node .\natmap\build.js
```

Catalog will be saved to `./out.json`

## To update catalog

1. Run `catalog-converter` on nationalmap/aremi catalog
2. Copy input (v7) and output (v8) to `natmap\in` and rename to match naming patterns:
  - `natmap\in\natmap-2020-09-03.json`
  - `natmap\in\natmap-2020-09-03-v8.json`
  
### AREMI catalog

Currently, there are manual modifications to v8 AREMI catalog:

- Untouched v8 JSON generated by `catalog-converter`: `natmap\in\aremi-2020-09-22-v8.json`
- v8 JSON with manual modifications `natmap\in\aremi-2020-09-22-v8-with-mods.json`

This approach is not ideal, but will let you see changes using a diff-tool. These changes should be made with JavaScript.
 
**Note:** `natmap/root.js` uses `natmap\in\aremi-2020-09-22-v8-with-mods.json`. So manual modifications are only needed when you update AREMI catalog.
  
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
| *s3 file name* | *commit version* |
|----------------|------------------|
| natmap-2021-02-10-v8.json | 9c1194b45b7e77df7e40efd9aae94e86a97e95f6 |
| natmap-2021-03-30-v8.json | 92f0b1744aa77eb8be9e894a775f27fabc98f873 |
| natmap-2021-04-13-v8.json | 5a5e99f5acc92907381dbcdd256e5a0490225f59 |
| natmap-2021-04-14-v8.json | 128bf155564c009ff091b84efd8445271e1e8289 |
| natmap-2021-04-16-v8.json | 3bd209bebcf2446715ea131ed4e52a5faf825dc5 |
| natmap-2021-04-16-v8.json | 3bd209bebcf2446715ea131ed4e52a5faf825dc5 |

**Catalogue history (in GitHub)**
| *catalog commit* | *this repo commit* |
|----------------|------------------|
| https://github.com/TerriaJS/saas-catalogs-public/commit/facb398ba31cf9b68ccfb92a227a566b6592555f | https://github.com/TerriaJS/natmap-catalog-v8/commit/061b2cbcbebd1fae24cfda0cf60f5886a57b0cda |

## Deploy
 
**UPDATE** catalogs are now stored in https://github.com/TerriaJS/saas-catalogs-public/tree/main/nationalmap:

- https://raw.githubusercontent.com/TerriaJS/saas-catalogs-public/main/nationalmap/dev.json
- https://raw.githubusercontent.com/TerriaJS/saas-catalogs-public/main/nationalmap/test.json
- https://raw.githubusercontent.com/TerriaJS/saas-catalogs-public/main/nationalmap/prod.json
 
 To deploy: 
 1. Update files in https://github.com/TerriaJS/saas-catalogs-public/tree/main/nationalmap
 2. Update URL in `initializationUrls` in SaaS `map-config`  
    - **Dev:** https://dev.saas.terria.io/record-editor/map-config-nationalmap
    - **Test:** https://test.saas.terria.io/record-editor/map-config-nationalmap
    - **Prod:** https://saas.terria.io/record-editor/map-config-nationalmap
 3. Manually update `map-config-nationalmap` Magda record
