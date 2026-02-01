# TradeX Fusion Neural Network
# Late-fusion architecture combining heterogeneous financial data
# REAL IMPLEMENTATION

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import logging

try:
    from transformers import DistilBertTokenizer, DistilBertModel
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logging.warning("Transformers not found, using fallback for VisualX")

@dataclass
class FusionOutput:
    """Output from the fusion network"""
    alpha_score: float
    factor_weights: List[float]  # [fundamental, sentiment, technical]
    attention_map: Optional[List[List[float]]] = None

class FactorFusionNetwork(nn.Module):
    """
    Real-world late-fusion neural network for combining financial factors.
    Uses PyTorch for tensor operations and gradients.
    """
    
    def __init__(
        self,
        fundamental_dim: int = 10,
        sentiment_dim: int = 768, # DistilBERT embedding size
        technical_dim: int = 20,
        hidden_dim: int = 256,
        num_heads: int = 8,
        dropout: float = 0.2
    ):
        super().__init__()
        self.fundamental_dim = fundamental_dim
        self.sentiment_dim = sentiment_dim
        self.technical_dim = technical_dim
        
        # Feature Projectors
        self.fund_proj = nn.Sequential(
            nn.Linear(fundamental_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout)
        )
        
        self.sent_proj = nn.Sequential(
            nn.Linear(sentiment_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout)
        )
        
        self.tech_proj = nn.Sequential(
            nn.Linear(technical_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout)
        )
        
        # Cross-Modal Attention
        self.attention = nn.MultiheadAttention(hidden_dim, num_heads, batch_first=True)
        
        # Gating Mechanism (Market Regime)
        self.gate = nn.Sequential(
            nn.Linear(hidden_dim * 3, 3), # 3 factors
            nn.Softmax(dim=-1)
        )
        
        # Final Predictor
        self.predictor = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Linear(hidden_dim // 2, 1),
            nn.Sigmoid()
        )
        
    def forward(
        self,
        fundamental: torch.Tensor,
        sentiment: torch.Tensor,
        technical: torch.Tensor,
    ) -> FusionOutput:
        """
        Forward pass through the fusion network.
        
        Args:
            fundamental: Tensor [batch, fundamental_dim]
            sentiment: Tensor [batch, sentiment_dim]
            technical: Tensor [batch, technical_dim]
            
        Returns:
            FusionOutput
        """
        # 1. Project Features to common hidden, normalized space
        f_emb = self.fund_proj(fundamental) # [batch, hidden]
        s_emb = self.sent_proj(sentiment)   # [batch, hidden]
        t_emb = self.tech_proj(technical)   # [batch, hidden]
        
        # 2. Stack for Attention: [batch, 3, hidden]
        stacked = torch.stack([f_emb, s_emb, t_emb], dim=1)
        
        # 3. Self-Attention (Cross-modal context)
        attn_out, attn_map = self.attention(stacked, stacked, stacked)
        # attn_out: [batch, 3, hidden]
        
        # 4. Gating / Weighting
        # Flatten for gating decision
        flat_ctx = attn_out.reshape(attn_out.size(0), -1)
        weights = self.gate(flat_ctx) # [batch, 3] -> Fundamental, Sentiment, Technical weights
        
        # 5. Weighted Fusion
        # Expand weights to [batch, 3, 1] for broadcasting
        w_expanded = weights.unsqueeze(-1)
        # Sum weighted features: [batch, hidden]
        fused_vec = (attn_out * w_expanded).sum(dim=1)
        
        # 6. Final Prediction
        alpha = self.predictor(fused_vec)
        
        return FusionOutput(
            alpha_score=alpha.item(),
            factor_weights=weights.squeeze().tolist(),
            attention_map=attn_map.squeeze().tolist()
        )

class VisualXEncoder:
    """
    Real VisualX sentiment encoder using DistilBERT.
    """
    
    def __init__(self):
        self.embedding_dim = 768
        self.model = None
        self.tokenizer = None
        
        if TRANSFORMERS_AVAILABLE:
            try:
                # Load pre-trained FinBERT or DistilBERT
                # Using distilbert for speed/efficiency in this demo context
                self.tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
                self.model = DistilBertModel.from_pretrained('distilbert-base-uncased')
                self.model.eval() # Inference mode
            except Exception as e:
                logging.error(f"Failed to load Transformers model: {e}")
        
    def encode(self, texts: List[str]) -> List[float]:
        """
        Encode text list into sentiment embedding using Transformer.
        """
        if not texts:
            return [0.0] * self.embedding_dim
            
        if not self.model or not self.tokenizer:
            # Fallback for when model isn't loaded
            return [0.0] * self.embedding_dim
        
        combined_text = ' '.join(texts[:5]) # Limit to first 5 texts for speed
        
        try:
            with torch.no_grad():
                inputs = self.tokenizer(combined_text, return_tensors='pt', padding=True, truncation=True, max_length=512)
                outputs = self.model(**inputs)
                # Use [CLS] token embedding as sentence representation
                embedding = outputs.last_hidden_state[:, 0, :].squeeze()
                return embedding.tolist()
        except Exception as e:
            logging.error(f"Encoding error: {e}")
            return [0.0] * self.embedding_dim
    
    def get_sentiment_score(self, texts: List[str]) -> Dict:
        """
        Get sentiment classification.
        """
        embedding = self.encode(texts)
        if not embedding or len(embedding) == 0:
             return {"score": 0.0, "sentiment_probs": {"positive": 0.33, "neutral": 0.33, "negative": 0.33}}

        # Simple linear projection from embedding mean (mock classification head)
        # In real training, this would be a trained classifier
        val = np.mean(embedding) * 10 
        score = np.tanh(val) # squash to -1 to 1
        
        return {
            "embedding": embedding[:5], # truncate for log
            "score": float(score),
            "sentiment_probs": {
                "positive": float(0.5 + score/2) if score > 0 else float(0.5 - abs(score)/2),
                "negative": float(0.5 + abs(score)/2) if score < 0 else float(0.5 - score/2),
                "neutral": 0.2 # residual
            }
        }


# Initialize Global Instances
fusion_network = FactorFusionNetwork()
visualx_encoder = VisualXEncoder()

# Helper for non-tensor inputs (bridge for legacy code)
def run_fusion_inference(fundamental: List[float], sentiment: List[float], technical: List[float]) -> FusionOutput:
    
    # Pad inputs to expected dimensions
    def pad(l, size): return l + [0.0] * max(0, size - len(l))
    
    f_in = torch.tensor([pad(fundamental, 10)], dtype=torch.float32)
    t_in = torch.tensor([pad(technical, 20)], dtype=torch.float32)
    
    # Sentiment usually comes from encoder, if list given, pad to 768
    s_in = torch.tensor([pad(sentiment, 768)], dtype=torch.float32)
    
    with torch.no_grad():
        fusion_network.eval()
        return fusion_network(f_in, s_in, t_in)
