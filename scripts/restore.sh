#!/bin/bash

# Database Recovery Script for InstyleEComerce
# Usage: ./restore.sh [postgres|mongodb] [backup_file] [local|s3]

DB_TYPE=${1:-postgres}
BACKUP_FILE=${2}
BACKUP_LOCATION=${3:-local}
BACKUP_DIR="/backups"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 [postgres|mongodb] [backup_file] [local|s3]"
    exit 1
fi

echo "Starting restore for $DB_TYPE database..."

# Download from S3 if specified
if [ "$BACKUP_LOCATION" = "s3" ]; then
    S3_BUCKET=${S3_BACKUP_BUCKET:-instyle-backups}
    
    if [ "$DB_TYPE" = "postgres" ]; then
        aws s3 cp "s3://$S3_BUCKET/postgres/$BACKUP_FILE" "$BACKUP_DIR/"
    else
        aws s3 cp "s3://$S3_BUCKET/mongodb/$BACKUP_FILE" "$BACKUP_DIR/"
    fi
    
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    echo "Backup downloaded from S3"
fi

if [ "$DB_TYPE" = "postgres" ]; then
    # PostgreSQL restore
    DB_HOST=${POSTGRES_HOST:-localhost}
    DB_PORT=${POSTGRES_PORT:-5432}
    DB_NAME=${POSTGRES_DB:-products}
    DB_USER=${POSTGRES_USER:-admin}
    DB_PASSWORD=${POSTGRES_PASSWORD:-123456}
    
    # Decompress if needed
    if [[ $BACKUP_FILE == *.gz ]]; then
        gunzip -c $BACKUP_FILE > /tmp/restore.sql
        RESTORE_FILE="/tmp/restore.sql"
    else
        RESTORE_FILE=$BACKUP_FILE
    fi
    
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < $RESTORE_FILE
    
    if [ $? -eq 0 ]; then
        echo "PostgreSQL restore completed successfully"
        rm -f /tmp/restore.sql
    else
        echo "PostgreSQL restore failed"
        exit 1
    fi
    
elif [ "$DB_TYPE" = "mongodb" ]; then
    # MongoDB restore
    MONGO_URI=${MONGO_URL:-mongodb://localhost:27017/orders}
    
    # Decompress if needed
    if [[ $BACKUP_FILE == *.tar.gz ]]; then
        tar -xzf $BACKUP_FILE -C /tmp/
        RESTORE_DIR=$(tar -tf $BACKUP_FILE | head -1 | cut -f1 -d"/")
        RESTORE_FILE="/tmp/$RESTORE_DIR"
    else
        RESTORE_FILE=$BACKUP_FILE
    fi
    
    mongorestore --uri="$MONGO_URI" --drop $RESTORE_FILE
    
    if [ $? -eq 0 ]; then
        echo "MongoDB restore completed successfully"
        rm -rf /tmp/$(basename $RESTORE_DIR)
    else
        echo "MongoDB restore failed"
        exit 1
    fi
else
    echo "Invalid database type. Use 'postgres' or 'mongodb'"
    exit 1
fi

echo "Restore process completed successfully"
