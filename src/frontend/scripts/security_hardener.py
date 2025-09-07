import json
import datetime
import yaml

def simulate_security_scan():
    """Simula un escaneo de hardening de seguridad."""
    print("Iniciando escaneo de hardening de seguridad (simulación)...")
    log_path = "security_hardening_scan.log"
    
    with open(log_path, "w") as f:
        f.write("### Security Hardening Scan Log ###\n")
        f.write(f"Timestamp: {datetime.datetime.now().isoformat()}\n")
        f.write("Scanner: OpenSCAP (Simulated)\n\n")
        f.write("Resultados del Escaneo:\n")
        f.write("-------------------------\n")
        f.write("[PASS] CIS Benchmark L1 for Docker applied successfully.\n")
        f.write("[PASS] TLS 1.2+ is enforced on all public-facing endpoints.\n")
        f.write("[WARN] SSH access is enabled with password authentication. Recommended: key-based auth only.\n")
        f.write("[PASS] No critical vulnerabilities found in container images.\n")
        f.write("[INFO] Zero-trust policy baseline implemented: default-deny on ingress/egress traffic.\n")
        f.write("\nEstado: ÉXITO - El hardening cumple con los requisitos mínimos. Se recomienda revisar las advertencias.\n")
        
    print(f"Log de escaneo de seguridad guardado en: {log_path}")

def generate_threat_model_from_openapi():
    """Genera un modelo de amenazas STRIDE básico a partir de openapi.yaml."""
    print("Generando modelo de amenazas STRIDE desde openapi.yaml...")
    report_path = "threat_model_stride.md"
    
    try:
        with open("openapi.yaml", "r") as f:
            api_spec = yaml.safe_load(f)
        paths = api_spec.get("paths", {})
    except FileNotFoundError:
        print("ADVERTENCIA: No se encontró openapi.yaml. Se generará un modelo de amenazas genérico.")
        paths = {
            "/api/v1/users": {"post": {"summary": "Crear usuario"}},
            "/api/v1/login": {"post": {"summary": "Autenticar usuario"}}
        }

    with open(report_path, "w") as f:
        f.write("# Modelo de Amenazas - STRIDE\n\n")
        f.write(f"**Fecha:** {datetime.date.today().isoformat()}\n\n")
        f.write("Este es un modelo de amenazas autogenerado basado en la especificación OpenAPI.\n\n")
        
        for path, methods in paths.items():
            for method, spec in methods.items():
                f.write(f"## Endpoint: `{method.upper()} {path}`\n\n")
                f.write(f"**Descripción:** {spec.get('summary', 'N/A')}\n\n")
                f.write("| Categoría STRIDE | Amenaza Potencial |\n")
                f.write("| :--- | :--- |\n")
                f.write("| **S**poofing | Un atacante podría suplantar la identidad de un usuario para realizar esta acción. |\n")
                f.write("| **T**ampering | Los datos en tránsito podrían ser interceptados y modificados sin una conexión TLS segura. |\n")
                f.write("| **R**epudiation | Podría faltar un registro de auditoría adecuado para rastrear quién realizó esta operación. |\n")
                f.write("| **I**nformation Disclosure | Una respuesta de error detallada podría filtrar información sensible del sistema. |\n")
                f.write("| **D**enial of Service | Múltiples peticiones a este endpoint podrían agotar los recursos del servidor. |\n")
                f.write("| **E**levation of Privilege | Una vulnerabilidad en la lógica de autorización podría permitir a un usuario sin privilegios ejecutar esta acción. |\n\n")

    print(f"Modelo de amenazas guardado en: {report_path}")

def generate_waf_rules():
    """Genera un archivo de configuración con reglas WAF de ejemplo."""
    print("Generando configuración de reglas WAF...")
    config_path = "waf_rules_config.json"
    
    waf_rules = {
        "name": "MetaStudio-WebApp-WAF-Policy",
        "description": "Reglas de WAF para proteger la aplicación contra amenazas comunes.",
        "rules": [
            {
                "id": "SQLi-Block-Rule-01",
                "priority": 1,
                "action": "BLOCK",
                "description": "Bloquear patrones comunes de inyección SQL en el cuerpo y los parámetros de la petición.",
                "match": {
                    "type": "RegexMatch",
                    "pattern": "(?i)(\\b(union|select|insert|delete|from|where)\\b.*\\b(select|from|where)\\b)"
                }
            },
            {
                "id": "XSS-Block-Rule-01",
                "priority": 2,
                "action": "BLOCK",
                "description": "Bloquear scripts maliciosos y ataques de Cross-Site Scripting (XSS).",
                "match": {
                    "type": "RegexMatch",
                    "pattern": "<script>.*</script>|javascript:"
                }
            },
            {
                "id": "Rate-Limit-Rule-01",
                "priority": 10,
                "action": "RATE_LIMIT",
                "description": "Limitar peticiones a 100 por minuto por IP para mitigar ataques de DoS.",
                "limit": 100,
                "window_seconds": 60
            }
        ]
    }
    
    with open(config_path, "w") as f:
        json.dump(waf_rules, f, indent=2)
        
    print(f"Configuración de WAF guardada en: {config_path}")

if __name__ == "__main__":
    print("--- Iniciando Proceso de Security Hardening (Simulación) ---")
    simulate_security_scan()
    generate_threat_model_from_openapi()
    generate_waf_rules()
    print("--- Proceso de Security Hardening Completado ---")
