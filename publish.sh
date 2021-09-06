#!/bin/sh

if [ "$1" = "" ]
then
    echo "Specify the name of the init file as the only argument."
    echo "The file will be published to:"
    echo "   s3://static.nationalmap.nicta.com.au/init/<name>.json"
    exit 1
fi

# Publish the catalog to an S3 bucket on AWS.
gzip --keep natmap/out.json
aws s3 --profile nationalmap cp --content-encoding gzip --content-type "application/json" natmap/out.json.gz s3://static.nationalmap.nicta.com.au/init/$1.json
rm natmap/out.json.gz
