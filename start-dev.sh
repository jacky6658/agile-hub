#!/bin/bash
cd /Users/user/Downloads/agile-hub
exec npx vite --port "${PORT:-3000}"
