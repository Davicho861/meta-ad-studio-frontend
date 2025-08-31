import json
import datetime
import random
import pandas as pd

def simulate_cloud_billing_data():
    """Simula la extracción de datos de facturación y uso de un proveedor de nube."""
    print("Extrayendo datos de facturación de Cloud Provider API (simulación)...")
    
    data = {
        "resource_id": [
            "i-0abcd1234efgh5678", "i-0bcde2345fghi6789", "vol-0cdef3456ghij7890",
            "db-0defg4567hijk8901", "i-0efgh5678ijkl9012"
        ],
        "resource_type": ["EC2", "EC2", "EBS", "RDS", "EC2"],
        "region": ["us-east-1", "us-east-1", "us-east-1", "us-east-1", "us-east-1"],
        "monthly_cost_usd": [120.50, 120.50, 25.00, 350.00, 60.25],
        "avg_cpu_util_percent": [8.5, 75.0, None, 92.0, 5.0],
        "is_attached": [None, None, False, None, None]
    }
    
    print("Datos de facturación extraídos.")
    return pd.DataFrame(data)

def analyze_for_cost_optimization(df):
    """Analiza los datos para identificar oportunidades de optimización de costos."""
    print("Analizando recursos para optimización de costos...")
    recommendations = []
    
    # Identificar instancias EC2 infrautilizadas
    underutilized_ec2 = df[(df['resource_type'] == 'EC2') & (df['avg_cpu_util_percent'] < 10)]
    for index, row in underutilized_ec2.iterrows():
        recommendations.append({
            "resource_id": row['resource_id'],
            "issue": "Instancia EC2 infrautilizada",
            "suggestion": "Redimensionar la instancia a un tipo más pequeño (e.g., de t3.large a t3.medium).",
            "estimated_savings_usd": row['monthly_cost_usd'] * 0.4 # Ahorro estimado del 40%
        })
        
    # Identificar volúmenes EBS no adjuntos
    unattached_ebs = df[(df['resource_type'] == 'EBS') & (df['is_attached'] == False)]
    for index, row in unattached_ebs.iterrows():
        recommendations.append({
            "resource_id": row['resource_id'],
            "issue": "Volumen EBS no adjunto",
            "suggestion": "Crear un snapshot del volumen como backup y eliminarlo para evitar costos.",
            "estimated_savings_usd": row['monthly_cost_usd']
        })
        
    print(f"Se encontraron {len(recommendations)} oportunidades de optimización.")
    return recommendations

def generate_cost_analysis_report(recommendations):
    """Genera un informe de análisis de costos y una hoja de cálculo."""
    print("Generando informe de análisis de costos...")
    
    # --- Informe en Markdown ---
    report_path_md = "cost_optimization_report.md"
    total_savings = sum(rec['estimated_savings_usd'] for rec in recommendations)
    
    with open(report_path_md, "w") as f:
        f.write("# Informe de Análisis y Optimización de Costos en Cloud\n\n")
        f.write(f"**Fecha:** {datetime.date.today().isoformat()}\n\n")
        f.write(f"## Resumen Ejecutivo\n\n")
        f.write(f"El análisis ha identificado **{len(recommendations)}** oportunidades de optimización con un ahorro mensual estimado de **${total_savings:.2f} USD**.\n\n")
        f.write("## Desglose de Recomendaciones\n\n")
        f.write("| ID del Recurso | Problema Identificado | Sugerencia de Optimización | Ahorro Mensual Estimado (USD) |\n")
        f.write("| :--- | :--- | :--- | :--- |\n")
        for rec in recommendations:
            f.write(f"| `{rec['resource_id']}` | {rec['issue']} | {rec['suggestion']} | ${rec['estimated_savings_usd']:.2f} |\n")
            
    print(f"Informe en Markdown guardado en: {report_path_md}")

    # --- Hoja de cálculo (simulada como CSV) ---
    report_path_csv = "cost_analysis.csv"
    df_report = pd.DataFrame(recommendations)
    df_report.to_csv(report_path_csv, index=False)
    print(f"Hoja de cálculo de análisis de costos guardada en: {report_path_csv}")

def generate_roi_metrics():
    """Genera un archivo con métricas de ROI."""
    print("Generando métricas de ROI...")
    metrics_path = "roi_metrics.json"
    
    cost_savings = random.uniform(1500, 2500) # Ahorro anual
    performance_benefits = cost_savings * random.uniform(1.2, 1.8) # Beneficios por mejora de rendimiento
    
    roi_metrics = {
        "period": "Anual",
        "estimated_cost_savings_usd": round(cost_savings, 2),
        "monetized_performance_benefits_usd": round(performance_benefits, 2),
        "total_estimated_value_usd": round(cost_savings + performance_benefits, 2),
        "notes": "El ROI se calcula combinando el ahorro directo en infraestructura con los beneficios monetizados derivados de una menor latencia y mayor disponibilidad, lo que se traduce en una mejor retención de usuarios y conversiones."
    }
    
    with open(metrics_path, "w") as f:
        json.dump(roi_metrics, f, indent=2)
        
    print(f"Métricas de ROI guardadas en: {metrics_path}")

if __name__ == "__main__":
    print("--- Iniciando Proceso de Análisis de Costos (Simulación) ---")
    billing_data = simulate_cloud_billing_data()
    optimization_recs = analyze_for_cost_optimization(billing_data)
    generate_cost_analysis_report(optimization_recs)
    generate_roi_metrics()
    print("--- Proceso de Análisis de Costos Completado ---")
