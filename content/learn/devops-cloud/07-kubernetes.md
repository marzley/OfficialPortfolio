---
slug: kubernetes-basics
title: "Kubernetes basics: pods, deployments, services, scaling, and when you don't need it"
after: docker-containers
---
# Kubernetes basics: pods, deployments, services, scaling, and when you don't need it

Docker runs containers on one machine. When you have many containers across many servers, something must decide where they run, restart them when they crash, scale them up and down and route traffic to them. That's a **container orchestrator**, and **Kubernetes** (often written **K8s**) is the most widely used.

## What Kubernetes does

- **Schedules** containers onto servers (nodes) with enough capacity
- **Self-heals:** restarts crashed containers and replaces failed nodes
- **Scales** the number of copies up or down (manually or automatically)
- **Rolls out** new versions gradually and rolls back if needed
- **Load balances** traffic across healthy copies
- **Manages configuration and secrets**

## Key objects

| Object | What it is |
|---|---|
| **Cluster** | A group of machines running Kubernetes |
| **Node** | One machine (virtual or physical) in the cluster |
| **Pod** | The smallest unit: one or more containers that run together |
| **Deployment** | Keeps a set number of identical pods running; handles updates |
| **Service** | A stable address that load-balances traffic to pods |
| **Ingress** | Routes outside HTTP/HTTPS traffic to services by domain or path |
| **ConfigMap / Secret** | Settings and sensitive values for pods |
| **Namespace** | A way to separate environments or teams in one cluster |

## A deployment and a service (YAML)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shop-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: shop-api
  template:
    metadata:
      labels:
        app: shop-api
    spec:
      containers:
        - name: api
          image: ghcr.io/marzley/shop-api:1.4.2
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits: { cpu: "500m", memory: "256Mi" }
---
apiVersion: v1
kind: Service
metadata:
  name: shop-api
spec:
  selector:
    app: shop-api
  ports:
    - port: 80
      targetPort: 3000
```

- **replicas: 3** keeps three copies running; if one dies, Kubernetes starts another.
- The **readinessProbe** stops traffic going to a pod until `/health` answers.
- **resources** tell Kubernetes how much CPU and memory each pod needs.
- The **Service** gives the pods one stable name (`shop-api`) inside the cluster.

## Everyday kubectl commands

```bash
kubectl apply -f shop-api.yaml              # create or update
kubectl get pods                            # list pods
kubectl describe pod shop-api-7d9f...       # details and events (great for debugging)
kubectl logs deploy/shop-api                # logs
kubectl scale deploy/shop-api --replicas=5  # scale
kubectl set image deploy/shop-api api=ghcr.io/marzley/shop-api:1.4.3   # update
kubectl rollout undo deploy/shop-api        # roll back
```

## Managed Kubernetes

Running Kubernetes yourself is hard. Most teams use a managed service where the provider runs the control plane:
- **Amazon EKS**, **Azure Kubernetes Service (AKS)**, **Google Kubernetes Engine (GKE)**
- Simpler providers also offer managed Kubernetes at lower prices.

Tools you'll meet: **Helm** (packages of Kubernetes YAML), **Argo CD** (GitOps: the cluster follows what's in Git), and the Kubernetes dashboard.

## Do you even need Kubernetes?

| You probably DON'T need Kubernetes if… | Kubernetes helps when… |
|---|---|
| You have one or two apps and small traffic | You run many services with different teams |
| A single server or a PaaS works fine | You need automatic scaling and self-healing at scale |
| Your team is small and new to containers | You have people to run and secure it |

Many Kenyan startups and SMEs run perfectly on a few servers, Docker Compose or a PaaS. Learn Kubernetes for your career, but choose it for a project only when it solves a real problem.

## Practise safely

- **minikube**, **kind** or **k3d** run a small cluster on your laptop.
- **Killercoda** and similar browser labs offer free Kubernetes scenarios.
- Managed clusters cost money even when idle: delete practice clusters when you finish.

:::think A pod keeps restarting every few seconds. How would you investigate?
Run kubectl describe pod to read events (image pull errors, failed probes, out-of-memory kills), kubectl logs (and logs --previous) to see the crash message, check environment variables and secrets, resource limits, and whether the readiness/liveness probes point to the right path and port.
:::

## Summary

- Kubernetes orchestrates containers across many machines: scheduling, healing, scaling and rollouts.
- Key objects: pods, deployments, services, ingress, ConfigMaps, Secrets and namespaces.
- kubectl applies YAML, inspects pods, reads logs, scales and rolls back.
- Use managed Kubernetes (EKS, AKS, GKE) and only when the project really needs it.

```quiz
Q: What is the smallest deployable unit in Kubernetes? (one word)
A: pod
Q: Which object gives pods a stable address and load-balances to them? (one word)
A: service
Q: Which command rolls back a deployment? (write like kubectl rollout undo)
A: kubectl rollout undo | rollout undo
```
