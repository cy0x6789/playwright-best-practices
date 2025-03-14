#!/bin/bash

# Default environment
ENV="dev"
TAGS=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -e|--env)
            ENV="$2"
            shift
            shift
            ;;
        -t|--tags)
            TAGS="$2"
            shift
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Load environment variables based on environment
if [ -f ".env.${ENV}" ]; then
    echo "Loading environment variables from .env.${ENV}"
    export $(cat .env.${ENV} | grep -v '^#' | xargs)
else
    echo "Environment file .env.${ENV} not found"
    exit 1
fi

# Run tests with optional tags
if [ -n "$TAGS" ]; then
    echo "Running tests with tags: $TAGS in $ENV environment"
    npx playwright test --grep "$TAGS"
else
    echo "Running all tests in $ENV environment"
    npx playwright test
fi
