#!/bin/bash

NAMESPACE=default  # Đổi nếu không dùng namespace default
STATEFULSET_NAME=redis-cluster
YAML_FILE=redis-cluster.yaml  # File yaml cấu hình Redis

echo "🔄 Xoá StatefulSet Redis Cluster..."
kubectl delete statefulset $STATEFULSET_NAME --namespace $NAMESPACE

echo "🧹 Xoá PVC cũ..."
kubectl delete pvc -l app=redis-cluster --namespace $NAMESPACE

echo "🚀 Deploy lại Redis Cluster từ YAML..."
kubectl apply -f $YAML_FILE --namespace $NAMESPACE

echo "⏳ Đợi các pod Redis sẵn sàng..."
kubectl rollout status statefulset $STATEFULSET_NAME --namespace $NAMESPACE

echo "⏰ Chờ 10s để các pod thật sự ready..."
sleep 10

echo "📦 Init Redis Cluster..."
kubectl exec -n $NAMESPACE -it redis-cluster-0 -- redis-cli --cluster create \
  redis-cluster-0.redis-cluster.$NAMESPACE.svc.cluster.local:6379 \
  redis-cluster-1.redis-cluster.$NAMESPACE.svc.cluster.local:6379 \
  redis-cluster-2.redis-cluster.$NAMESPACE.svc.cluster.local:6379 \
  redis-cluster-3.redis-cluster.$NAMESPACE.svc.cluster.local:6379 \
  redis-cluster-4.redis-cluster.$NAMESPACE.svc.cluster.local:6379 \
  redis-cluster-5.redis-cluster.$NAMESPACE.svc.cluster.local:6379 \
  --cluster-replicas 1
