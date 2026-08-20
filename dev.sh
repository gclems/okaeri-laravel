#!/usr/bin/env bash

trap "./vendor/bin/sail stop" EXIT

./vendor/bin/sail up -d

npm run dev
