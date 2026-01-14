#!/bin/bash

# Create main directories
mkdir -p .github/workflows
mkdir -p .vscode

# CLIENT STRUCTURE
mkdir -p client/public
mkdir -p client/src/{api/{core,services},assets/{fonts,images,styles},components/{atoms,molecules,organisms,builder-widgets},composables,config,layouts,router/guards,stores,utils,views/{auth,master-admin,dashboard/{products,library,pages,reports,settings},storefront}}

# SERVER STRUCTURE
mkdir -p server/src/{config,constants,controllers,dtos,interfaces,middlewares,routes/v1,services,utils}
mkdir -p server/prisma/migrations
mkdir -p server/tests

echo "Struktur folder berhasil dibuat!"
