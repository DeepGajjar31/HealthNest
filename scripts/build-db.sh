#!/bin/bash
cd database
docker build -t db .
docker tag db:latest enblitztechnologies/healthnest:mysql
cd ..
