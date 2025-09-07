# Open Policy Agent (OPA) Policies for Post-Quantum Cryptography (PQC)
# Enforces the use of quantum-resistant algorithms in the infrastructure.

package planetary.security.pqc

# ==============================================================================
# Default state: Deny all configurations unless explicitly allowed.
# ==============================================================================
default allow = false

# ==============================================================================
# Rule: Allow TLS configurations that use approved PQC cipher suites.
# ==============================================================================
allow {
    # Check if the input is a TLS configuration
    input.kind == "TLSConfiguration"
    
    # List of approved PQC cipher suites
    approved_pqc_ciphers := {
        "TLS_KYBER_768_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_DILITHIUM_3_RSA_WITH_AES_256_GCM_SHA384"
    }
    
    # Verify that the configured cipher suite is in the approved list
    approved_pqc_ciphers[input.spec.cipherSuite]
}

# ==============================================================================
# Rule: Deny JWTs that are not signed with a PQC algorithm.
# ==============================================================================
deny[msg] {
    # Check if the input is a JWT token
    input.kind == "JWT"
    
    # List of approved PQC signing algorithms
    approved_pqc_algorithms := {"DILITHIUM3", "FALCON512"}
    
    # Decode the JWT header (assuming a helper function `io.jwt.decode_header`)
    header := io.jwt.decode_header(input.token)
    
    # Check if the algorithm in the header is not in the approved list
    not approved_pqc_algorithms[header.alg]
    
    msg := sprintf("JWT is not signed with an approved PQC algorithm. Found: %v", [header.alg])
}

# ==============================================================================
# Rule: Ensure all external communication endpoints use Quantum Key Distribution (QKD).
# ==============================================================================
allow {
    # Check if the input is a network policy or service definition
    input.kind == "NetworkPolicy"
    
    # This is a conceptual rule. In a real implementation, this would need to
    # integrate with a QKD management system to verify that keys are being
    # distributed and rotated correctly.
    
    # For now, we'll just check for an annotation that indicates QKD is enabled.
    input.metadata.annotations.qkd_enabled == "true"
}

deny[msg] {
    input.kind == "NetworkPolicy"
    not input.metadata.annotations.qkd_enabled
    msg := "Network policy does not enforce Quantum Key Distribution (QKD)."
}
