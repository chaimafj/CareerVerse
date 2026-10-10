"""Inférence CareerNet : transforme un étudiant en top des métiers recommandés.

Le prétraitement reproduit exactement celui de l'entraînement
(DL_CareerVerser/project/preprocess.py) grâce aux paramètres de preprocess.json.
"""
import json
import math
import threading
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parent / "model_files"
MODEL_VERSION = "careernet-split-4000-500-500"


class ModelUnavailable(Exception):
    """Le moteur d'inférence (torch ou les fichiers du modèle) est absent."""


class CareerPredictor:
    def __init__(self, model_dir=MODEL_DIR):
        try:
            import numpy as np
            import torch
        except ImportError as exc:
            raise ModelUnavailable(
                "PyTorch n'est pas installé dans l'environnement du backend (pip install -r requirements.txt)."
            ) from exc
        from .careernet import CareerNet

        self.np, self.torch = np, torch
        with open(model_dir / "preprocess.json", encoding="utf-8") as f:
            self.meta = json.load(f)
        m = self.meta
        self.model = CareerNet(len(m["static_cols"]), len(m["labs"]), len(m["lab_metrics"]), len(m["classes"]))
        state = torch.load(model_dir / "careernet.pt", map_location="cpu")
        self.model.load_state_dict(state["state_dict"])
        self.model.eval()
        self.static_mean = np.array(m["static_mean"])
        self.static_std = np.array(m["static_std"])
        self.lab_mean = np.array(m["lab_mean"])
        self.lab_std = np.array(m["lab_std"])

    @property
    def classes(self):
        return self.meta["classes"]

    def predict(self, static, labs):
        """static : {colonne: valeur} pour les 24 colonnes statiques.
        labs : {lab_key: {score, time_min, attempts, hints_used, enjoyment_1_5}} pour les labs faits.
        Retourne la liste des 9 métiers triés par probabilité décroissante."""
        np, torch, m = self.np, self.torch, self.meta
        x_static = np.array([float(static[c]) for c in m["static_cols"]])
        x_static = (x_static - self.static_mean) / self.static_std

        x_lab = np.zeros((len(m["labs"]), len(m["lab_metrics"])))
        mask = np.zeros(len(m["labs"]), dtype=bool)
        for i, lab in enumerate(m["labs"]):
            values = labs.get(lab)
            if not values:
                continue
            v = np.array([float(values[k]) for k in m["lab_metrics"]])
            for j, k in enumerate(m["lab_metrics"]):
                if k in m["log_metrics"]:
                    v[j] = math.log1p(v[j])
            x_lab[i] = (v - self.lab_mean) / self.lab_std
            mask[i] = True

        with torch.no_grad():
            logits = self.model(
                torch.tensor(x_static[None], dtype=torch.float32),
                torch.tensor(x_lab[None], dtype=torch.float32),
                torch.tensor(mask[None], dtype=torch.bool),
            )
            proba = torch.softmax(logits, -1)[0].numpy()
        order = proba.argsort()[::-1]
        return [{"career": self.classes[i], "probability": round(float(proba[i]), 4)} for i in order]


_predictor = None
_lock = threading.Lock()


def get_predictor():
    """Charge le modèle une seule fois par processus."""
    global _predictor
    if _predictor is None:
        with _lock:
            if _predictor is None:
                _predictor = CareerPredictor()
    return _predictor
