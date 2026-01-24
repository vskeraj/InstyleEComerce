#!/bin/bash

# Database Backup Script for InstyleEComerce
# Usage: ./backup.sh [postgres|mongodb] [local|s3]

DB_TYPE=${1:-postgres}
BACKUP_LOCATION=${2:-local}
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "Starting backup for $DB_TYPE database..."

if [ "$DB_TYPE" = "postgres" ]; then
    # PostgreSQL backup
    DB_HOST=${POSTGRES_HOST:-localhost}
    DB_PORT=${POSTGRES_PORT:-5432}
    DB_NAME=${POSTGRES_DB:-products}
    DB_USER=${POSTGRES_USER:-admin}
    DB_PASSWORD=${POSTGRES_PASSWORD:-123456}
    
    BACKUP_FILE="$BACKUP_DIR/postgres_backup_$DATE.sql"
    
    PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_FILE
    
    if [ $? -eq 0 ]; then
        echo "PostgreSQL backup completed: $BACKUP_FILE"
        
        # Compress backup
        gzip $BACKUP_FILE
        echo "Backup compressed: $BACKUP_FILE.gz"
    else
        echo "PostgreSQL backup failed"
        exit 1
    fi
    
elif [ "$DB_TYPE" = "mongodb" ]; then
    # MongoDB backup
    MONGO_URI=${MONGO_URL:-mongodb://localhost:27017/orders}
    
    BACKUP_FILE="$BACKUP_DIR/mongodb_backup_$DATE"
    
    mongodump --uri="$MONGO_URI" --out=$BACKUP_FILE
    
    if [ $? -eq 0 ]; then
        echo "MongoDB backup completed: $BACKUP_FILE"
        
        # Compress backup
        tar -czf "$BACKUP_FILE.tar.gz" -C $BACKUP_DIR $(basename $BACKUP_FILE)
        rm -rf $BACKUP_FILE
        echo "Backup compressed: $BACKUP_FILE.tar.gz"
    else
        echo "MongoDB backup failed"
        exit 1
    fi
else
    echo "Invalid database type. Use 'postgres' or 'mongodb'"
    exit 1
fi

# Upload to S3 if specified
if [ "$BACKUP_LOCATION" = "s3" ]; then
    S3_BUCKET=${S3_BACKUP_BUCKET:-instyle-backups}
    
    if [ "$DB_TYPE" = "postgres" ]; then
        aws s3 cp "$BACKUP_FILE.gz" "s3://$S3_BUCKET/postgres/"
    else
        aws s3 cp "$BACKUP_FILE.tar.gz" "s3://$S3_BUCKET/mongodb/"
    fi
    
    echo "Backup uploaded to S3"
fi

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "*backup_*" -mtime +7 -delete
echo "Old backups cleaned up"

echo "Backup process completed successfully"
