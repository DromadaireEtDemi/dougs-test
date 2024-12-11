#!/bin/bash

name=${1:-dougs-test}

# Step 1: Install dependencies with Yarn
echo "Installing dependencies..."
yarn install

# Check if yarn install was successful
if [ $? -ne 0 ]; then
  echo "Dependency installation failed. Exiting..."
  exit 1
fi

# Step 2: Run tests with Jest
echo "Running tests..."
yarn test --no-watchman

# Capture the exit code from Jest
test_exit_code=$?

# Check if tests passed or failed
if [ $test_exit_code -ne 0 ]; then
  echo "Some tests failed. Exiting..."
  exit $test_exit_code
else
  echo "All tests passed!"
fi

# Step 3: Build Docker image
echo "Building Docker image '$name'..."
docker build -t $name .

# Check if docker build was successful
if [ $? -ne 0 ]; then
  echo "Docker image build failed. Exiting..."
  exit 1
else
  echo "Docker image '$name' built successfully!"
fi

# Step 4: Creating the cluster
kind create cluster --config kube-config.yaml --name $name-cluster

echo "Loading $name image"
kind load --name "$name-cluster" docker-image $name:1.0.0

# Step 5: Populate cluster using Helm
echo "Applying Helm config"
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx
helm install $name ./helm/

echo "Infrastructure is ready and project deployed!"









