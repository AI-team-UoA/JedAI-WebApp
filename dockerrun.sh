#!/bin/sh
DATA=/tmp/allDatasets
FILE=/tmp/allDatasets.tar.xz

if [[ ! -f "$FILE" ]]; then
    wget -O /tmp/allDatasets.tar.xz https://data.mendeley.com/public-files/datasets/4whpm32y47/files/f5856017-b011-4044-b1f1-9fa1531c95cf/file_downloaded
    tar -xf /tmp/allDatasets.tar.xz -C /tmp/
fi
