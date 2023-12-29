#!/bin/bash

cd apps/conveyor/backend

echo ">>> operation build"
cd operation
rm -rf dist
pnpm install
pnpm build
cp -rf node_modules dist/

echo ">>> log-troller build"
cd ../log-troller
rm -rf dist
pnpm install
pnpm build
cp -rf node_modules dist/
