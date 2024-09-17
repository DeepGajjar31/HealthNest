#!/bin/bash
cd backend
docker build -t backend .
docker tag backend:latest enblitztechnologies/healthnest:backend
docker push enblitztechnologies/healthnest:backend
cd ..
