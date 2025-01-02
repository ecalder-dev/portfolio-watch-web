# Makefile

# Define variables
NODE_MODULES = node_modules
BUILD_DIR = build

# Default target
all: install build

# Install dependencies
install:
	@echo "Installing dependencies..."
	@npm install

# Build the production version
build: clean
	@echo "Building the production version..."
	@npm run build

# Clean the build directory
clean:
	@echo "Cleaning the build directory..."
	@rm -rf $(BUILD_DIR)

# Clean node_modules
clean-modules:
	@echo "Cleaning node_modules..."
	@rm -rf $(NODE_MODULES)

# Clean everything
clean-all: clean clean-modules

make spotlessApply:
	npx prettier --write .

# Run the application in development mode
start:
	@echo "Starting the application in development mode..."
	@npm start

.PHONY: all install build clean clean-modules clean-all start spotlessApply