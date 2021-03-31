***Branch Note***
This branch will build a customised static catalog for Vic DT. Do not merge this branch to the main.

1. After building an updated catalog, rename the output `./natmap/out.json` to something meaningful, e.g., `./natmap/national-energy-water-satellite-vic-reorganised-v8-2021-03-31.json`, then upload it to `https://s3.console.aws.amazon.com/s3/buckets/tiles.terria.io?region=ap-southeast-2&prefix=static/victoria-digitaltwin/`.<br><br>

2. Record the history in the following table.
    ***Vic DT Catalog History***
    | *s3 file name* | *commit version* |
    |----------------|------------------|
    | national-energy-water-satellite-vic-reorganised-v8-2021-03-31.json | 63d897408a656baf4af3b2f2d6e7902688449ef7 |
    | `<new catalog file name>` | `<commit version>` |

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

**Catalogue history**
| *s3 file name* | *commit version* |
|----------------|------------------|
| natmap-2021-02-10-v8.json | 9c1194b45b7e77df7e40efd9aae94e86a97e95f6 |
| natmap-2021-03-30-v8.json | 92f0b1744aa77eb8be9e894a775f27fabc98f873 |

## Deploy
 
 Currently, we are storing NationalMap catalogs at https://tiles.terria.io/static/natmap-prod-2021-02-01-1406-converted-v8.json, 
 which is an S3 bucket here - https://s3.console.aws.amazon.com/s3/buckets/tiles.terria.io?region=ap-southeast-2&prefix=static/
 
 To deploy: 
 1. Rename `out.json` to follow something like `natmap-prod-2021-02-01-1406-converted-v8.json` pattern
 2. Upload to `tiles.terria.io/static` bucket
 3. Update URL in `initializationUrls` in SaaS `map-config`  
    - **Dev:** https://dev.saas.terria.io/record-editor/map-config-nationalmap
    - **Test:** https://test.saas.terria.io/record-editor/map-config-nationalmap
    - **Prod:** https://saas.terria.io/record-editor/map-config-nationalmap
