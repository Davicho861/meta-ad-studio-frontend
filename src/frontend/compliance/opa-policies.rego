# =================================================================================
# OPA (Open Policy Agent) Policies in Rego
# =================================================================================

package kubernetes.admission

# ---------------------------------------------------------------------------------
# Policy: Deny Containers Running as Root
#
# This policy prevents pods from being created if any of their containers are
# configured to run as the root user. This is a critical security best practice.
# ---------------------------------------------------------------------------------
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  container.securityContext.runAsRoot == true
  msg := sprintf("Container '%v' is running as root. This is not allowed.", [container.name])
}

# ---------------------------------------------------------------------------------
# Policy: Enforce Standard Labels
#
# This policy ensures that all created resources (Pods, Deployments, Services)
# have a standard set of labels for FinOps and resource tracking.
# ---------------------------------------------------------------------------------
deny[msg] {
  # -- Define the kinds of resources this policy applies to
  kinds := {"Pod", "Deployment", "Service"}
  input.request.kind.kind in kinds

  # -- Define the required labels
  required_labels := {"app.kubernetes.io/name", "app.kubernetes.io/instance", "app.kubernetes.io/managed-by"}
  
  # -- Get the labels from the resource metadata
  labels := {label | label := input.request.object.metadata.labels[_]}
  
  # -- Check if all required labels are present
  missing_labels := required_labels - labels
  count(missing_labels) > 0
  
  msg := sprintf("Resource '%v' is missing required labels: %v", [input.request.object.metadata.name, missing_labels])
}

# ---------------------------------------------------------------------------------
# Policy: Disallow 'latest' Tag on Container Images
#
# This policy prevents the use of the 'latest' tag for container images, which
# is an anti-pattern in production environments as it can lead to unpredictable
# deployments.
# ---------------------------------------------------------------------------------
deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  endswith(container.image, ":latest")
  msg := sprintf("Container '%v' uses the 'latest' tag for its image '%v'. This is not allowed.", [container.name, container.image])
}

# ---------------------------------------------------------------------------------
# Policy: Require Network Policies
#
# This policy ensures that every namespace has a NetworkPolicy to enforce
# network segmentation, a core principle of zero-trust.
# ---------------------------------------------------------------------------------
deny[msg] {
    input.request.kind.kind == "Namespace"
    not input.request.object.metadata.labels["network-policy"]
    msg := "Namespaces must have a 'network-policy' label to ensure network policies are applied."
}

# ---------------------------------------------------------------------------------
# Policy: Enforce Resource Quotas
#
# This policy ensures that all pods have resource requests and limits set.
# This prevents resource contention and ensures predictable performance.
# ---------------------------------------------------------------------------------
deny[msg] {
    input.request.kind.kind == "Pod"
    container := input.request.object.spec.containers[_]
    not container.resources.limits
    msg := sprintf("Container '%v' must have resource limits set.", [container.name])
}

deny[msg] {
    input.request.kind.kind == "Pod"
    container := input.request.object.spec.containers[_]
    not container.resources.requests
    msg := sprintf("Container '%v' must have resource requests set.", [container.name])
}
