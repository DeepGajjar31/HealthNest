#!/bin/bash
cd frontend
docker build -t frontend .
docker tag frontend:latest enblitztechnologies/healthnest:frontend
cd ..
