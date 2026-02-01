import torch
import torch.optim as optim
import torch.nn as nn
from fusion_network import FactorFusionNetwork, VisualXEncoder
import numpy as np
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_fusion_model(epochs=10):
    """
    Training loop for the Factor Fusion Network.
    In a real scenario, this would load a dataset of (Fundamentals, Sentiment, Technicals) -> Alpha/Price Target.
    """
    logger.info("Initializing Fusion Network Training...")
    
    model = FactorFusionNetwork()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss() # Predicting continuous alpha score
    
    # Mock Dataset Generation (Batch Size 32)
    # 100 batches
    logger.info("Generating synthetic financial data for pre-training...")
    
    for epoch in range(epochs):
        epoch_loss = 0
        
        for _ in range(100):
            # Random Inputs [Batch, Dim]
            fund_data = torch.randn(32, 10)
            tech_data = torch.randn(32, 20)
            sent_data = torch.randn(32, 768) # Realbert embeddings
            
            # Target: Let's assume a simple ground truth relationship for demo training
            # Alpha = 0.5 * Fund[0] + 0.3 * Sent[0] + 0.2 * Tech[0] + noise
            target = 0.5 * fund_data[:, 0] + 0.3 * sent_data[:, 0] + 0.2 * tech_data[:, 0]
            target = torch.sigmoid(target).unsqueeze(1) # Normalize 0-1
            
            # Zero Gradients
            optimizer.zero_grad()
            
            # Forward Pass
            # We need to modify forward slightly for batch training or call direct component logic
            # The class forward expects tensors so we are good
            output = model(fund_data, sent_data, tech_data)
            
            # Output is an object with float value for single inference.
            # We need raw tensor output for training.
            # Let's peek into the model structure again or modify it to return tensors in training mode.
            # For this script, we'll re-implement the forward's tensor logic to get the graph:
            
            # --- Inline Forward for Gradient Tracking ---
            f_emb = model.fund_proj(fund_data)
            s_emb = model.sent_proj(sent_data)
            t_emb = model.tech_proj(tech_data)
            stacked = torch.stack([f_emb, s_emb, t_emb], dim=1)
            attn_out, _ = model.attention(stacked, stacked, stacked)
            flat_ctx = attn_out.reshape(attn_out.size(0), -1)
            weights = model.gate(flat_ctx)
            w_expanded = weights.unsqueeze(-1)
            fused_vec = (attn_out * w_expanded).sum(dim=1)
            pred_alpha = model.predictor(fused_vec)
            # ---------------------------------------------
            
            loss = criterion(pred_alpha, target)
            loss.backward()
            optimizer.step()
            
            epoch_loss += loss.item()
            
        avg_loss = epoch_loss / 100
        logger.info(f"Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.6f}")
        
    logger.info("Training Complete. Saving model weights...")
    torch.save(model.state_dict(), "fusion_model_v1.pt")
    logger.info("Model saved to fusion_model_v1.pt")

if __name__ == "__main__":
    train_fusion_model()
