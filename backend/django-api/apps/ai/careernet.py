"""Architecture CareerNet (copie de DL_CareerVerser/project/model.py).

Doit rester identique à la classe utilisée pour l'entraînement, sinon les poids
de model_files/careernet.pt ne se chargent pas.
"""
import torch
import torch.nn as nn


class CareerNet(nn.Module):
    def __init__(self, n_static, n_labs, n_metrics, n_classes, d=64, heads=4, layers=2, dropout=0.2):
        super().__init__()
        self.static_net = nn.Sequential(
            nn.Linear(n_static, 128), nn.GELU(), nn.Dropout(dropout),
            nn.Linear(128, d), nn.GELU(),
        )
        self.lab_proj = nn.Linear(n_metrics, d)
        self.lab_emb = nn.Embedding(n_labs, d)
        self.cls = nn.Parameter(torch.zeros(1, 1, d))
        enc_layer = nn.TransformerEncoderLayer(d, heads, dim_feedforward=2 * d, dropout=dropout,
                                               batch_first=True, activation="gelu", norm_first=True)
        self.encoder = nn.TransformerEncoder(enc_layer, layers, enable_nested_tensor=False)
        self.head = nn.Sequential(
            nn.LayerNorm(2 * d), nn.Linear(2 * d, d), nn.GELU(), nn.Dropout(dropout), nn.Linear(d, n_classes),
        )
        self.register_buffer("lab_ids", torch.arange(n_labs))

    def forward(self, static, lab, mask):
        """static (B,S)  lab (B,L,M)  mask (B,L) bool, True = lab fait"""
        B = static.size(0)
        h_static = self.static_net(static)
        tokens = self.lab_proj(lab) + self.lab_emb(self.lab_ids)[None]
        tokens = torch.cat([self.cls.expand(B, -1, -1), tokens], 1)
        pad = torch.cat([torch.zeros(B, 1, dtype=torch.bool, device=mask.device), ~mask], 1)
        h_labs = self.encoder(tokens, src_key_padding_mask=pad)[:, 0]
        return self.head(torch.cat([h_static, h_labs], 1))
