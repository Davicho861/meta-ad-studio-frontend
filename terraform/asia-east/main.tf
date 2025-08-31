# Terraform configuration for the Asia-East region

provider "aws" {
  region = "ap-east-1"
}

resource "aws_eks_cluster" "primary" {
  name     = "eks-asia-east"
  role_arn = "arn:aws:iam::123456789012:role/eks-cluster-role"

  vpc_config {
    subnet_ids = ["subnet-abcde012", "subnet-bcde012a"]
  }
}

resource "aws_db_instance" "main" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "13.3"
  instance_class       = "db.t3.micro"
  name                 = "adstudiodb"
  username             = "admin"
  password             = "password"
  parameter_group_name = "default.postgres13"
}

resource "aws_elasticache_cluster" "cache" {
  cluster_id           = "ad-studio-cache-asia"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  engine_version       = "6.2"
  port                 = 6379
}
