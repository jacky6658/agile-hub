#!/bin/bash
cd /Users/step1ne/Downloads/agile-hub
exec npx vite --port "${PORT:-3000}"
