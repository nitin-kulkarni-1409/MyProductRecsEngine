# MyProductRecsEngine
This is a recommendation engine service that helps in providing AI assisted product recommendations
# E-Commerce Product Recommendation Engine

An end-to-end recommendation system for e-commerce platforms using
Machine Learning and Deep Learning techniques.

## Features
- Personalized product recommendations
- Cold-start handling using content-based models
- Deep learning–based Neural Collaborative Filtering
- Offline evaluation with industry-standard metrics
- Real-time inference via REST API

## Models Implemented
- Matrix Factorization (ALS / SVD)
- Content-Based Filtering (TF-IDF + cosine similarity)
- Deep Learning Recommendation Model (Two-Tower / NCF)

## Tech Stack
- Python, PyTorch / TensorFlow
- Pandas, NumPy, Scikit-learn
- FastAPI
- Docker

## Results
Deep learning models improved NDCG@10 by **~40%** over baseline
collaborative filtering.

## Use Cases
- Product detail page recommendations
- Homepage personalization
- Cross-sell and upsell suggestions

Request comes in
   ↓
Validate params
   ↓
Load users.json
   ↓
Does user exist?
   ├─ YES
   │    ├─ Has history? → behavioral personalization
   │    └─ No history   → contextual personalization
   │
   └─ NO
        ├─ Create user
        └─ Contextual personalization
   ↓
Return honest response
