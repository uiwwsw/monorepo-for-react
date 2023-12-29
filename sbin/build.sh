#!/bin/bash

pnpm i
pnpm prepare
node apps/conveyor/frontend/deploy.cjs

rm -rf sbin/image
mkdir sbin/image

cp -rf  deploy sbin/image/web
cp sbin/config.json sbin/image/web/dist/

apps/conveyor/backend/deploy.sh

cp -rf apps/conveyor/backend/operation/dist sbin/image/operation
cp -rf apps/conveyor/backend/log-troller/dist sbin/image/log-troller
cp -rf node_modules sbin/images/