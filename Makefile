# Deploys a kind cluster, the config is passed in to override default cluster
# Added in this project explicitly to facilitate macOS port mapping issue while using nodeports
# Other OS would work without extra host Mapping except Macos
# https://github.com/kubernetes-sigs/kind/issues/808#issuecomment-525046566
cluster_name = $(shell if [ -n "${CLUSTER_NAME}" ]; then echo ${CLUSTER_NAME}; else echo "test-dougs"; fi)

# Local Node related command
run-dev:
	npm run nest:dev

run-prod:
	npm run nest:prod

test:
	npm run test
	
test-cov:
	npm run test:cov

# Kind related command
deploy-cluster:
	kind create cluster --name $(cluster_name) --config kube-config.yaml
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
	echo "Will wait 60 second to ensure ingress is deployed"
	sleep 60
	kubectl wait --namespace ingress-nginx deployment --for=condition=available ingress-nginx-controller --timeout=60s

delete-cluster:
	kind delete cluster --name $(cluster_name)
