"""
AI Models Manager for UpTrade AI
Handles FinBERT, RoBERTa Q&A, NER models with caching and optimization
"""

from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from transformers import AutoModelForQuestionAnswering, AutoModelForTokenClassification
import torch
from functools import lru_cache
import logging
from typing import List, Dict, Any
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIModelsManager:
    """Manages all AI models with lazy loading and caching"""
    
    def __init__(self):
        self.device = 0 if torch.cuda.is_available() else -1
        self.models = {}
        logger.info(f"🤖 AI Models Manager initialized. Device: {'GPU' if self.device == 0 else 'CPU'}")
    
    @lru_cache(maxsize=1)
    def get_sentiment_model(self):
        """Load FinBERT for financial sentiment analysis"""
        if 'sentiment' not in self.models:
            logger.info("📊 Loading FinBERT sentiment model...")
            try:
                self.models['sentiment'] = pipeline(
                    "sentiment-analysis",
                    model="ProsusAI/finbert",
                    device=self.device,
                    truncation=True,
                    max_length=512
                )
                logger.info("✅ FinBERT loaded successfully")
            except Exception as e:
                logger.error(f"❌ Failed to load FinBERT: {e}")
                # Fallback to lighter model
                self.models['sentiment'] = pipeline(
                    "sentiment-analysis",
                    model="distilbert-base-uncased-finetuned-sst-2-english",
                    device=self.device
                )
        return self.models['sentiment']
    
    @lru_cache(maxsize=1)
    def get_qa_model(self):
        """Load RoBERTa for document Q&A"""
        if 'qa' not in self.models:
            logger.info("📖 Loading RoBERTa Q&A model...")
            try:
                self.models['qa'] = pipeline(
                    "question-answering",
                    model="deepset/roberta-base-squad2",
                    device=self.device
                )
                logger.info("✅ RoBERTa Q&A loaded successfully")
            except Exception as e:
                logger.error(f"❌ Failed to load RoBERTa Q&A: {e}")
                raise
        return self.models['qa']
    
    @lru_cache(maxsize=1)
    def get_ner_model(self):
        """Load NER model for entity extraction"""
        if 'ner' not in self.models:
            logger.info("🏷️ Loading NER model...")
            try:
                self.models['ner'] = pipeline(
                    "ner",
                    model="dslim/bert-base-NER",
                    device=self.device,
                    aggregation_strategy="simple"
                )
                logger.info("✅ NER model loaded successfully")
            except Exception as e:
                logger.error(f"❌ Failed to load NER model: {e}")
                raise
        return self.models['ner']
    
    def analyze_sentiment(self, texts: List[str]) -> List[Dict[str, Any]]:
        """
        Analyze sentiment of financial texts using FinBERT
        
        Args:
            texts: List of text strings to analyze
            
        Returns:
            List of sentiment results with label and score
        """
        try:
            model = self.get_sentiment_model()
            
            # Batch processing for efficiency
            results = []
            batch_size = 8
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                batch_results = model(batch)
                results.extend(batch_results)
            
            # Format results
            formatted_results = []
            for text, result in zip(texts, results):
                formatted_results.append({
                    'text': text[:100] + '...' if len(text) > 100 else text,
                    'sentiment': result['label'].lower(),
                    'confidence': round(result['score'], 4),
                    'score': self._sentiment_to_score(result['label'], result['score'])
                })
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"Sentiment analysis failed: {e}")
            return [{'error': str(e), 'text': text} for text in texts]
    
    def answer_question(self, question: str, context: str) -> Dict[str, Any]:
        """
        Answer questions based on document context
        
        Args:
            question: Question to answer
            context: Document context
            
        Returns:
            Answer with confidence score
        """
        try:
            model = self.get_qa_model()
            
            # Limit context length for performance
            max_context_length = 4000
            if len(context) > max_context_length:
                context = context[:max_context_length]
            
            result = model(question=question, context=context)
            
            return {
                'question': question,
                'answer': result['answer'],
                'confidence': round(result['score'], 4),
                'start': result['start'],
                'end': result['end']
            }
            
        except Exception as e:
            logger.error(f"Q&A failed: {e}")
            return {'error': str(e), 'question': question}
    
    def extract_entities(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract named entities (companies, metrics, etc.) from text
        
        Args:
            text: Text to analyze
            
        Returns:
            List of extracted entities
        """
        try:
            model = self.get_ner_model()
            
            # Limit text length
            max_length = 2000
            if len(text) > max_length:
                text = text[:max_length]
            
            entities = model(text)
            
            # Format and filter entities
            formatted_entities = []
            for entity in entities:
                formatted_entities.append({
                    'text': entity['word'],
                    'type': entity['entity_group'],
                    'confidence': round(entity['score'], 4),
                    'start': entity['start'],
                    'end': entity['end']
                })
            
            return formatted_entities
            
        except Exception as e:
            logger.error(f"Entity extraction failed: {e}")
            return [{'error': str(e)}]
    
    def _sentiment_to_score(self, label: str, confidence: float) -> float:
        """Convert sentiment label to numeric score (-1 to 1)"""
        label_lower = label.lower()
        
        if 'positive' in label_lower:
            return confidence
        elif 'negative' in label_lower:
            return -confidence
        else:  # neutral
            return 0.0
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        return {
            'device': 'GPU' if self.device == 0 else 'CPU',
            'loaded_models': list(self.models.keys()),
            'cuda_available': torch.cuda.is_available(),
            'gpu_name': torch.cuda.get_device_name(0) if torch.cuda.is_available() else None
        }


# Global instance (lazy loaded)
_ai_manager = None

def get_ai_manager() -> AIModelsManager:
    """Get or create global AI manager instance"""
    global _ai_manager
    if _ai_manager is None:
        _ai_manager = AIModelsManager()
    return _ai_manager
