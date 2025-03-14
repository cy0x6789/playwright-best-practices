#!/bin/bash

# Default values
ENV="qa"
TAGS=""
PARALLEL=1
REPORTER="list"
RETRY_COUNT=2

# Help function
show_help() {
    echo "Usage: ./run-tests.sh [options]"
    echo "Options:"
    echo "  -e, --env        Environment to run tests against (dev|qa|staging|prod) [default: qa]"
    echo "  -t, --tags       Test tags to run (e.g., 'smoke,regression')"
    echo "  -p, --parallel   Number of parallel workers [default: 1]"
    echo "  -r, --reporter   Test reporter (list|html|junit) [default: list]"
    echo "  -c, --retries    Number of retries for failed tests [default: 2]"
    echo "  -h, --help       Show this help message"
}

# Parse arguments
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
        -p|--parallel)
        PARALLEL="$2"
        shift
        shift
        ;;
        -r|--reporter)
        REPORTER="$2"
        shift
        shift
        ;;
        -c|--retries)
        RETRY_COUNT="$2"
        shift
        shift
        ;;
        -h|--help)
        show_help
        exit 0
        ;;
        *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
    esac
done

# Validate environment
if [[ ! "$ENV" =~ ^(dev|qa|staging|prod)$ ]]; then
    echo "Invalid environment: $ENV"
    exit 1
fi

# Load environment variables
if [ -f ".env.$ENV" ]; then
    export $(cat .env.$ENV | grep -v '^#' | xargs)
fi

# Build test command
CMD="npx playwright test"

# Add tags if specified
if [ ! -z "$TAGS" ]; then
    CMD="$CMD --grep \"@$TAGS\""
fi

# Add parallel option
if [ "$PARALLEL" -gt 1 ]; then
    CMD="$CMD --workers $PARALLEL"
fi

# Add reporter
CMD="$CMD --reporter=$REPORTER"

# Add retry count
CMD="$CMD --retries=$RETRY_COUNT"

# Run tests
echo "Running tests with command: $CMD"
echo "Environment: $ENV"
eval $CMD
