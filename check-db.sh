#!/bin/bash

# Script to check if sections are being saved properly

echo "=== Checking Database for Page Sections ==="
echo ""

# Get page ID from argument or use default
PAGE_ID=${1:-"default-page-id"}

echo "Looking for page with ID: $PAGE_ID"
echo ""

# Using prisma studio or direct query
cd /Users/mpik/Downloads/ANTITESA/server

# Show all pages
echo "Available pages:"
npx prisma db execute --stdin <<SQL
SELECT id, title, slug FROM Page;
SQL

echo ""
echo "To check sections for a specific page, run:"
echo "npx prisma db execute --stdin <<< 'SELECT * FROM Section WHERE pageId = \"YOUR_PAGE_ID\";'"
