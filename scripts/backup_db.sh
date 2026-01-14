#!/bin/bash
# =========================================
# CoffeeShop CMS - Database Backup Script
# Run daily via cron for disaster recovery
# =========================================

# Variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/coffeeshop"
BACKUP_FILE="backup_coffeeshop_$TIMESTAMP.sql"
S3_BUCKET="${S3_BUCKET:-my-coffeeshop-backups}"
RETENTION_DAYS=30

# Database connection (from environment or defaults)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-coffeeshop}"
DB_PASSWORD="${DB_PASSWORD:-password}"
DB_NAME="${DB_NAME:-coffeeshop_cms}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

echo -e "${YELLOW}[$(date)] Starting database backup...${NC}"

# Step 1: Dump PostgreSQL database
echo "Dumping database: $DB_NAME"
PGPASSWORD=$DB_PASSWORD pg_dump \
    -h $DB_HOST \
    -p $DB_PORT \
    -U $DB_USER \
    -d $DB_NAME \
    -F c \
    -b \
    -v \
    -f "$BACKUP_DIR/$BACKUP_FILE.dump"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database dump completed${NC}"
else
    echo -e "${RED}✗ Database dump failed${NC}"
    exit 1
fi

# Step 2: Compress the backup
echo "Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE.dump"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Compression completed${NC}"
else
    echo -e "${RED}✗ Compression failed${NC}"
    exit 1
fi

# Step 3: Upload to AWS S3 (optional)
if command -v aws &> /dev/null && [ -n "$AWS_ACCESS_KEY_ID" ]; then
    echo "Uploading to S3: s3://$S3_BUCKET/"
    aws s3 cp "$BACKUP_DIR/$BACKUP_FILE.dump.gz" "s3://$S3_BUCKET/database/"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ S3 upload completed${NC}"
    else
        echo -e "${YELLOW}⚠ S3 upload failed - keeping local backup${NC}"
    fi
else
    echo -e "${YELLOW}⚠ AWS CLI not configured - skipping S3 upload${NC}"
fi

# Step 4: Cleanup old backups (local)
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "backup_coffeeshop_*.gz" -mtime +$RETENTION_DAYS -delete

echo -e "${GREEN}[$(date)] Backup completed successfully!${NC}"
echo "Backup file: $BACKUP_DIR/$BACKUP_FILE.dump.gz"

# Summary
ls -lh "$BACKUP_DIR/$BACKUP_FILE.dump.gz"
