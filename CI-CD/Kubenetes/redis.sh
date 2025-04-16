#!/bin/bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

helm upgrade --install redis-cluster bitnami/redis \
  --namespace default \
  --create-namespace \
  -f ./k8s/redis/values.yaml

# # ---
# # # redis-config.yaml
# # apiVersion: v1
# # kind: ConfigMap
# # metadata:
# #   name: redis-config
# # data:
# #   redis.conf: |
# #     port 6379
# #     cluster-enabled yes
# #     cluster-config-file nodes.conf
# #     cluster-node-timeout 5000
# #     appendonly yes
# #     dir /data
# # ---
# # # redis-service.yaml
# # apiVersion: v1
# # kind: Service
# # metadata:
# #   name: redis-headless
# # spec:
# #   clusterIP: None
# #   selector:
# #     app: redis
# #   ports:
# #     - port: 6379
# #   publishNotReadyAddresses: true
# # ---
# # # redis-statefulset.yaml
# # apiVersion: apps/v1
# # kind: StatefulSet
# # metadata:
# #   name: redis
# # spec:
# #   serviceName: "redis-headless"
# #   replicas: 6
# #   selector:
# #     matchLabels:
# #       app: redis
# #   template:
# #     metadata:
# #       labels:
# #         app: redis
# #     spec:
# #       containers:
# #         - name: redis
# #           image: redis:7.2-alpine
# #           command:
# #             - redis-server
# #             - "/etc/redis/redis.conf"
# #           ports:
# #             - containerPort: 6379
# #           volumeMounts:
# #             - name: data
# #               mountPath: /data
# #             - name: config
# #               mountPath: /etc/redis
# #       volumes:
# #         - name: config
# #           configMap:
# #             name: redis-config
# #   volumeClaimTemplates:
# #     - metadata:
# #         name: data
# #       spec:
# #         accessModes: ["ReadWriteOnce"]
# #         resources:
# #           requests:
# #             storage: 1Gi
# # ---
# # redis-cluster-init.yaml
# apiVersion: batch/v1
# kind: Job
# metadata:
#   name: redis-cluster-init
# spec:
#   template:
#     spec:
#       containers:
#         - name: redis-init
#           image: redis:7.2-alpine
#           command: ["/bin/sh", "-c"]
#           args:
#             - |
#               apk add --no-cache bash;
#               echo "Waiting for Redis nodes to be ready...";
#               sleep 60;
#               echo "Creating cluster...";
#               yes yes | redis-cli --cluster create \
#                 redis-0.redis-headless.default.svc.cluster.local:6379 \
#                 redis-1.redis-headless.default.svc.cluster.local:6379 \
#                 redis-2.redis-headless.default.svc.cluster.local:6379 \
#                 redis-3.redis-headless.default.svc.cluster.local:6379 \
#                 redis-4.redis-headless.default.svc.cluster.local:6379 \
#                 redis-5.redis-headless.default.svc.cluster.local:6379 \
#                 --cluster-replicas 1;
#       restartPolicy: OnFailure
# # ---
# # # redis-nodeport.yaml
# # apiVersion: v1
# # kind: Service
# # metadata:
# #   name: redis-0-nodeport
# # spec:
# #   type: NodePort
# #   selector:
# #     statefulset.kubernetes.io/pod-name: redis-0
# #   ports:
# #     - port: 6379
# #       targetPort: 6379
# #       nodePort: 30000
# # ---
# # apiVersion: v1
# # kind: Service
# # metadata:
# #   name: redis-1-nodeport
# # spec:
# #   type: NodePort
# #   selector:
# #     statefulset.kubernetes.io/pod-name: redis-1
# #   ports:
# #     - port: 6379
# #       targetPort: 6379
# #       nodePort: 30001
# # ---
# # apiVersion: v1
# # kind: Service
# # metadata:
# #   name: redis-2-nodeport
# # spec:
# #   type: NodePort
# #   selector:
# #     statefulset.kubernetes.io/pod-name: redis-2
# #   ports:
# #     - port: 6379
# #       targetPort: 6379
# #       nodePort: 30002
# # ---
# # apiVersion: v1
# # kind: Service
# # metadata:
# #   name: redis-3-nodeport
# # spec:
# #   type: NodePort
# #   selector:
# #     statefulset.kubernetes.io/pod-name: redis-3
# #   ports:
# #     - port: 6379
# #       targetPort: 6379
# #       nodePort: 30003
# # ---
# # apiVersion: v1
# # kind: Service
# # metadata:
# #   name: redis-4-nodeport
# # spec:
# #   type: NodePort
# #   selector:
# #     statefulset.kubernetes.io/pod-name: redis-4
# #   ports:
# #     - port: 6379
# #       targetPort: 6379
# #       nodePort: 30004
# # ---
# # apiVersion: v1
# # kind: Service
# # metadata:
# #   name: redis-5-nodeport
# # spec:
# #   type: NodePort
# #   selector:
# #     statefulset.kubernetes.io/pod-name: redis-5
# #   ports:
# #     - port: 6379
# #       targetPort: 6379
# #       nodePort: 30005
