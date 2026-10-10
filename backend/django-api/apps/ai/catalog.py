"""Vocabulaire partagé entre le modèle CareerNet, l'API et le frontend.

Ce module n'importe pas torch : les serializers et les vues peuvent l'utiliser
même si le moteur d'inférence n'est pas disponible.
"""

# 13 compétences auto-évaluées (0-10), dans l'ordre du dataset d'entraînement.
SKILLS = [
    "programming", "python", "linux", "docker_k8s", "cloud", "networking", "security",
    "databases_sql", "web_frontend", "math_stats", "testing_quality",
    "problem_solving", "systems_thinking",
]

SKILL_LABELS = {
    "programming": "Programmation",
    "python": "Python",
    "linux": "Linux",
    "docker_k8s": "Docker / Kubernetes",
    "cloud": "Cloud",
    "networking": "Réseaux",
    "security": "Sécurité",
    "databases_sql": "Bases de données / SQL",
    "web_frontend": "Web frontend",
    "math_stats": "Maths / statistiques",
    "testing_quality": "Tests / qualité",
    "problem_solving": "Résolution de problèmes",
    "systems_thinking": "Vision système",
}

# 5 domaines d'intérêt déclarés (1-5).
INTEREST_DOMAINS = ["software_dev", "web_design", "infrastructure", "security", "data_ai"]

INTEREST_LABELS = {
    "software_dev": "Développement logiciel",
    "web_design": "Web et design d'interface",
    "infrastructure": "Infrastructure, cloud, réseaux",
    "security": "Cybersécurité",
    "data_ai": "Data et intelligence artificielle",
}

# Les 9 Career Labs connus du modèle. `career_id` est l'identifiant utilisé par le frontend.
LABS = [
    {"key": "lab_backend_api", "title": "Backend API", "career": "Backend Developer", "career_id": "backend-developer"},
    {"key": "lab_web_ui", "title": "Web UI", "career": "Frontend/Web Developer", "career_id": "frontend-developer"},
    {"key": "lab_devops_pipeline", "title": "DevOps pipeline", "career": "DevOps Engineer", "career_id": "devops-engineer"},
    {"key": "lab_cloud_deploy", "title": "Cloud deployment", "career": "Cloud Engineer", "career_id": "cloud-engineer"},
    {"key": "lab_security_ctf", "title": "Security CTF", "career": "Cybersecurity Analyst", "career_id": "cybersecurity-analyst"},
    {"key": "lab_data_analysis", "title": "Data analysis", "career": "Data Scientist", "career_id": "data-analyst"},
    {"key": "lab_sql_database", "title": "SQL database", "career": "Database Administrator", "career_id": "database-administrator"},
    {"key": "lab_network_config", "title": "Network configuration", "career": "System/Network Admin", "career_id": "network-admin"},
    {"key": "lab_qa_testing", "title": "QA testing", "career": "QA/Test Engineer", "career_id": "qa-engineer"},
]
LAB_KEYS = [lab["key"] for lab in LABS]
LAB_BY_CAREER_ID = {lab["career_id"]: lab for lab in LABS}

# Champs du profil indispensables au modèle (hors compétences et intérêts).
ACADEMIC_FIELDS = {
    "year_of_study": (1, 5),
    "gpa_20": (0, 20),
    "grade_math_20": (0, 20),
    "grade_programming_20": (0, 20),
    "grade_networks_20": (0, 20),
}

# Le modèle a été entraîné sur des temps simulés de 10 à 150 minutes par lab
# (environ 45 min pour un étudiant moyen). Une mission réelle de la plateforme dure
# environ 2 minutes : on ramène le temps réel sur l'échelle d'entraînement.
# Ce calibrage est à réajuster quand de vraies données seront disponibles.
REFERENCE_SECONDS_PER_MISSION = 120
REFERENCE_TRAINING_MINUTES = 45
