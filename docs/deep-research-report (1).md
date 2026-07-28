# Argus: An NLP-Based Cybersecurity Log Analysis Platform

## Executive Summary  
Argus is a comprehensive platform to automate cybersecurity log analysis using NLP and machine learning. It ingests raw system and network logs, processes them through an NLP pipeline, and provides outputs such as log classification, named-entity extraction, abstractive summarization, and suggested remediation.  By leveraging tools like NLTK, spaCy, scikit-learn, Hugging Face Transformers and Gensim, Argus covers the full spectrum of the TEE7101/TEE7100 syllabus topics. The design includes log ingestion (via APIs or file uploads), preprocessing (tokenization, regex parsing), feature extraction (bag-of-words, TF–IDF, Word2Vec embeddings), text classification (traditional ML and fine-tuned transformers), named-entity recognition for key fields (e.g. IPs, usernames), abstractive summarization (fine-tuned BART/T5), optional translation, semantic similarity search (sentence-transformers), and a remediation recommender.  Argus will be built with open-source libraries and deployed via a web interface (e.g. FastAPI backend with a React or Streamlit frontend). We specify datasets (HDFS, BGL, AWS CloudTrail logs, etc. ), data schemas, annotation guidelines, evaluation metrics (e.g. accuracy, precision, recall, F1 for classification; ROUGE for summaries), and a semester-long timeline with an MVP and advanced features. Key risks (data privacy, label bias) and mitigations (anonymization, synthetic data) are identified. Tables compare model and tech choices, and we include example code, API specs, and diagrams (below) to illustrate the design.  

## Project Overview and Objectives  
Argus aims to **automate the analysis of security logs** (system, application, network logs) by applying NLP techniques.  The main objectives are: (1) build a log ingestion pipeline; (2) preprocess and normalize logs (tokenize, parse to fields); (3) extract features using CountVectorizer, TF–IDF and trainable embeddings (Word2Vec); (4) classify logs into threat categories (e.g. brute-force, malware, info) using both classic ML (sklearn) and fine-tuned transformer models; (5) perform named-entity extraction on logs (detect IPs, usernames, CVE ids) using spaCy or custom models; (6) generate abstractive summaries of log sequences using seq2seq models (BART/T5); (7) support semantic search of similar incidents (via sentence-transformer embeddings); (8) suggest remediation steps (from a curated rulebase or learned).  The platform will include a REST API and user interface. Deliverables include documentation, code repository, demo, and final presentation. This project covers all relevant NLP topics in the syllabus (tokenization, embeddings, classification, transformers) in a real-world application.  For example, **event logs record key information** but “consume a large amount of time” to analyse manually; Argus addresses this by automating tasks using NLP/LLMs. 

## Data Sources, Schema and Annotation  
**Datasets:** We will use public log datasets for training and evaluation. Examples include:  
- **HDFS** (Hadoop Distributed File System) logs – widely used for log analysis research (∼38 hrs, 1.47GiB, 11M lines). Labeled anomalies are available.  
- **BGL** (Blue Gene/L supercomputer) logs – ≈4.7M lines.  
- **Windows Event Logs** (system audit logs) – ∼114M lines.  
- **Linux Syslog** – generic system logs (over 130M lines).  
- **AWS CloudTrail** – logs of AWS account activity. For example, the Flaws.cloud dataset has ~1.94M records (2017–2020).  
- **Kaggle/security logs** – e.g. archived malware scan logs, vulnerability logs, etc.  
These datasets offer varied log formats (JSON, CSV, text) and sizes; Table 1 below compares key options:

| Dataset        | Domain         | Size/Events          | Format          | Annotations         |
|----------------|----------------|----------------------|-----------------|---------------------|
| HDFS           | Big Data Sys   | ~11M lines (1.47GiB) | text (Hadoop format) | Anomalies labeled |
| Blue Gene/L (BGL) | HPC Sys     | ~4.7M lines (708MB)  | text           | Anomalies labeled |
| Windows Event  | OS Security    | ~114M lines (26GB)   | text/CSV       | Raw logs (no label) |
| Linux Syslog   | OS/Apps        | ~2.3M lines (120MB)  | text           | Raw logs            |
| AWS CloudTrail | Cloud Audit    | ~1.94M events          | JSON           | Raw (event type)    |
| Custom (Synthetic) | All        | Variable            | Various        | As needed           |

*Table 1: Example log datasets. Sources: LogHub repository and Flaws.cloud blog.*  

**Data Schema:** Logs typically contain fields like timestamp, source/destination IP, user, action type, status, etc. For instance, a CloudTrail record is JSON with keys such as `"eventTime"`, `"eventSource"`, `"eventName"`, `"awsRegion"`, and `"sourceIPAddress"`. In Argus, we will parse logs into structured records (e.g. JSON or database tables) with columns like `timestamp`, `service`, `user`, `src_ip`, `dst_ip`, `action`, `message`, etc.  Sample schema (for CloudTrail): 

```yaml
timestamp: string  # e.g. "2023-07-19T21:17:28Z"
event_source: string  # e.g. "ec2.amazonaws.com"
event_name: string    # e.g. "StartInstances"
aws_region: string
source_ip: string     # e.g. "192.0.2.0"
user_agent: string
request_params: object
response_elements: object
```

We will document the schema (JSON/SQL) and use tools (e.g. PostgreSQL) to store the normalized logs. We will also define annotation guidelines: 
- **Classification Labels:** e.g. “BruteForce”, “Malware”, “Reconnaissance”, “Normal”, etc. Labels can be assigned by security experts or semi-automatically (keywords, known rules). A guideline document will detail each category with examples. 
- **Entities:** We will tag log fields like IP addresses, user names, file paths, CVE identifiers, and error codes. Annotation instructions will define how to label multi-word entities (e.g. “FAILED_LOGIN” for repeated failures). 
- **Summaries:** We may prepare a small set of human-written summaries of log sequences for evaluation (e.g. summarising a series of events).

For privacy, logs with sensitive PII (usernames, IPs) will be anonymized. For example, the CloudTrail dataset from Flaws.cloud was anonymized using the Wernicke algorithm to mask IPs/users. Synthetic data: if needed, we can generate artificial logs by simulating event patterns or using text generation (e.g. by prompting GPT models to produce realistic log lines).  

## System Architecture  

```mermaid
flowchart TB
    subgraph Ingestion
      A[Log Ingestion/API] --> B[Raw Logs Storage]
    end
    subgraph Preprocessing
      B --> C[Parsing & Cleaning]
      C --> D[Tokenization (NLTK/spaCy)]
      C --> E[Regex Field Extraction]
      D --> F[Preprocessed Text]
      E --> F
    end
    subgraph Feature_Engineering
      F --> G[CountVectorizer/TF-IDF]
      F --> H[Word2Vec Embeddings (Gensim)]
      F --> I[Transformer Embeddings (BERT)]
    end
    subgraph Modeling
      G --> J[Traditional Classifier (sklearn)]
      H --> J
      I --> K[Transformer Classifier (fine-tuned BERT)]
      F --> L[NER (spaCy)]
      F --> M[Summarization (BART/T5)]
      F --> N[Semantic Search (Sentence-Transformer)]
      J --> O[Results Aggregation]
      K --> O
      L --> O
      M --> O
      N --> O
    end
    subgraph Output
      O --> P[API/Frontend]
      P --> Q[Dashboard/UI]
    end
```

*Mermaid flowchart: Argus data flow. Logs are ingested, preprocessed (parsing, tokenization), features are extracted (BoW, TF–IDF, Word2Vec, Transformers), then models produce classification, NER, summarization, and retrieval outputs, which feed into a user interface.*  

**Components:**  
- **Ingestion:** A REST API (e.g. FastAPI) or file-upload service to accept raw logs (JSON, CSV, text). Logs are timestamped and stored (e.g. in PostgreSQL or a file system). 
- **Preprocessing:** Use NLTK/spaCy for tokenization and POS tagging. Perform cleaning (lowercasing, punctuation removal) and regex parsing to extract structured fields. E.g. regex for IPv4: ```r"\b\d{1,3}(?:\.\d{1,3}){3}\b"```, timestamps: ```r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z"```. This normalizes logs into consistent records (see example API spec below).  
- **Feature Engineering:** Convert text to numeric features: (a) **CountVectorizer** and **TfidfVectorizer** from scikit-learn to create sparse term-frequency features; (b) **Word2Vec** embeddings (via Gensim) trained on the log corpus; (c) BERT/Transformer embeddings for each log line (from a pretrained model). These representations enable models to learn semantics beyond bag-of-words. Gensim’s Word2Vec produces dense vectors where semantically similar words map to nearby vectors.  

- **Classification Models:** Multiple approaches will be implemented and compared. Traditional ML (e.g. Logistic Regression, Random Forest, SVM) will be trained on TF–IDF or averaged word2vec features. Additionally, a HuggingFace Transformer model (e.g. BERT or DistilBERT) will be fine-tuned for log classification using the `Trainer` API. Hyperparameters (learning rate, epochs, batch size) will be tuned via grid search or Bayesian optimization, and a baseline (e.g. majority class) will be measured. Table 2 compares some options:

| Model / Method   | Features/Input               | Pros                      | Cons                        |
|------------------|------------------------------|---------------------------|-----------------------------|
| Logistic Reg     | TF–IDF vectors               | Simple, interpretable     | May miss context            |
| Random Forest    | TF–IDF or Word2Vec           | Handles nonlinearity      | Slower, less interpretable  |
| BERT (fine-tuned)| Tokenized text (transformer) | Captures context deeply | Requires GPU, slower      |
| TextCNN / LSTM   | Word2Vec inputs              | Good performance on texts | Requires custom training    |
| Naive Bayes      | Bag-of-words                | Fast, baseline            | Assumes word independence   |

*Table 2: Comparison of classification models. Transformer models (BERT) generally yield higher accuracy on language tasks, but simpler models serve as baselines and are easier to deploy.*  

- **Named-Entity Recognition (NER):** We will use spaCy to detect entities like IP addresses, user accounts, file paths, CVEs, etc. SpaCy’s pretrained models can recognize generic entities; we may extend them via rule-based matching or fine-tune a model with annotated log data. For example, given a log line like:  
  ```
  2026-07-28 10:15:00 - WARNING - Failed login attempt from 203.0.113.5 by user 'admin'.
  ```  
  an NER output might be: `[(203.0.113.5, IP_ADDRESS), (admin, USER)]`. SpaCy is efficient for large-scale processing and can label sequences via a pipeline.  

- **Summarization:** We will implement abstractive summarization using pretrained seq2seq models (BART-large or T5). BART, a Transformer encoder–decoder, was shown to work well for news summarization. We will fine-tune (or directly use) `facebook/bart-large-cnn` on our log data (possibly synthetic pairs of logs and summaries). Example use: 
  ```python
  from transformers import pipeline
  summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
  summary = summarizer(log_sequence, max_length=50, min_length=15)
  ```  
  As evaluation, we’ll compute ROUGE scores against reference summaries (if available). For instance, summarizing a brute-force login incident:  
  ```
  Input: "Over 10 failed SSH logins from 203.0.113.5 within 10 minutes, targeting user root and admin. No success; accounts locked out."
  BART summary: "Multiple failed login attempts (10+) from IP 203.0.113.5 targeted root/admin accounts within 10 minutes, indicating a brute-force attack."
  ```  

- **Optional Seq2Seq Translation:** As an optional feature, we could integrate multilingual support (e.g. translate logs or summaries). Hugging Face’s MarianMT models allow on-the-fly translation (e.g. English↔Spanish) if needed, though logs are usually English.  

- **Semantic Similarity Search:** To find similar incidents, we use *sentence-transformers*. We’ll encode each log entry (or summary) into a dense vector, store them in a vector database or in-memory index, and for a given query embed, retrieve nearest neighbours by cosine similarity. This implements “semantic search”. For example, a query about “brute-force SSH attack” would retrieve past logs of similar failed-login patterns. This approach handles synonyms and paraphrases better than keyword search.  

- **Remediation Recommender:** Based on classification or detected keywords, Argus will output remediation suggestions. This could be rule-based (e.g. for “BruteForce” suggest “block IP, reset passwords”) or learned (train a simple classifier/regressor mapping log features to action tags). These rules will be documented in a lookup table (e.g. mapping MITRE ATT&CK tactics to responses).  

## Example API (OpenAPI-style)  
```yaml
paths:
  /api/logs/analyze:
    post:
      summary: Analyze a log entry
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                logText: { type: string }
      responses:
        '200':
          description: Analysis result
          content:
            application/json:
              schema:
                type: object
                properties:
                  category:    # Classification label
                    type: string
                  summary:     # Abstractive summary
                    type: string
                  entities:    # Named entities found
                    type: array
                    items:
                      type: object
                      properties:
                        text: { type: string }
                        label: { type: string }
                  relatedLogs:  # Similar logs retrieved
                    type: array
                    items: { type: string }
                  recommendation: { type: string }
```
This spec illustrates one endpoint. A real API would include additional endpoints (e.g. `/api/train` to train models, `/api/logs/bulk` for batch analysis).  

## Datasets and Data Management  
As shown in Table 1, Argus can leverage multiple datasets. We will download HDFS and BGL from public repositories (e.g. LogHub). CloudTrail logs can be obtained via AWS APIs or sample archives (Flaws.cloud provides anonymized records). For custom logs, we may simulate data or use logs from cloud providers (AWS, Azure) and popular tools (e.g. Splunk exam logs).  

**Data Storage:** Parsed logs and features will be stored in PostgreSQL (for structured fields) and possibly a vector database (or plain storage) for embeddings. JSON logs (like CloudTrail) will be parsed into tables (one per log type) or a unified schema.  

**Annotation and Synthetic Data:** We will create a small annotated dataset of log messages with labels (for classification) and with entity tags (for NER). Annotation guidelines will specify examples of each class. If real labeled data is scarce, we will generate synthetic logs by combining templates or using language models to simulate attack descriptions. Care will be taken to inject diversity (different IPs, users, actions) while maintaining realism.  

## Evaluation Metrics and Test Plan  
Each module will have its own evaluation:  

- **Preprocessing & NER:** Metrics like *precision, recall, F1* on extracted fields/entities (compare to a gold set).  
- **Classification:** Use accuracy and F1-score. For multi-class, we will report macro- and weighted-F1. A confusion matrix will highlight per-class performance. We will use cross-validation and a held-out test set. Baselines include a dummy classifier (most-frequent label).  
- **Summarization:** Use *ROUGE* scores (ROUGE-1, ROUGE-2, ROUGE-L) against human summaries. We may also conduct a small human evaluation for fluency and correctness.  
- **Semantic Retrieval:** Use *top-K accuracy* (does relevant log appear in top-K), and average cosine similarity. If available, benchmark with query-groundtruth pairs.  
- **Remediation:** If formulated as a classification, again use F1. If rule-based, we check coverage and correctness on test cases.  

We will define a test plan: create test suites for each API (unit tests and integration tests) to verify outputs. For models, we will run experiments to tune hyperparameters: for example, try learning rates {2e-5,3e-5}, batch sizes {8,16}, epochs 3–5, and record validation F1 to choose the best.  

## Technical Stack and Trade-offs  
Argus will use popular open-source tools:  
- **Python (3.10+)** with libraries: NLTK, spaCy, scikit-learn, Gensim, Transformers (PyTorch backend), sentence-transformers, pandas, SQLAlchemy.  
- **Database:** PostgreSQL (relational) for structured logs. We may also use a simple NoSQL (MongoDB) or ElasticSearch for log storage/search, but PostgreSQL suffices for structured queries.  
- **Backend:** FastAPI for REST APIs (lightweight, async) or Flask.  
- **Frontend:** React (for rich UI) or Streamlit (for rapid prototyping). Streamlit is faster to implement but less flexible; React requires more work but yields a production-like UI. Trade-off table:  

| Component   | Option A       | Option B           | Comments                    |
|-------------|----------------|--------------------|-----------------------------|
| Frontend    | React          | Streamlit         | **React** (JS) is robust for custom dashboards; **Streamlit** (Python) is quicker to prototype.  |
| Database    | PostgreSQL     | ElasticSearch      | **PostgreSQL** handles complex queries and joins; **Elasticsearch** excels at full-text, but adds complexity. |
| Transformer Framework | Hugging Face Transformers (PyTorch) | TensorFlow/Keras | Hugging Face has many pretrained NLP models. PyTorch/TensorFlow are both viable; we choose PyTorch here (trainer API). |
| DevOps      | GitHub Actions | Jenkins/Travis CI  | **GitHub Actions** integrates easily with GitHub repo and supports Docker. |
| Deployment  | AWS (EC2/EKS)  | Local Docker      | AWS allows scale; local Docker is cheaper for prototype. |
| Vector DB   | FAISS          | Milvus            | Both support k-NN search. FAISS (Facebook) is simpler; Milvus is scalable with more features. |

*Table 3: Technology options and trade-offs.*  

**Deployment & Infrastructure:** For the final project, a simple deployment is fine: e.g. one server (or cloud VM) running the FastAPI app, models loaded in memory (or via microservices). For scale, we could containerize Argus (Docker) and use Kubernetes/EKS.  Hardware requirements: For training transformer models, a GPU is recommended. For example, AWS p3.2xlarge (1×V100) costs ~$3.06/hr on-demand (or ~$0.38/hr spot). We will estimate costs: e.g., training a BERT model for 3 epochs on 10k logs might take ~1–2 hours on GPU (~$6), with inference on CPU/GPU as needed.  

**CI/CD:** We will set up automated tests and use GitHub Actions to run linting, unit tests, and optionally model training on push. Docker can be used to containerize the app and simplify deployment.  

## Module Interfaces and Sample Code  
- **Regex Parsing:** Example Python code for extracting IP and timestamp:  
  ```python
  import re
  line = "2026-07-28T10:15:00Z src=192.168.1.5 dest=10.0.0.1 action=FAILED_LOGIN"
  ip_match = re.search(r"\b\d{1,3}(?:\.\d{1,3}){3}\b", line)
  time_match = re.search(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z", line)
  ```
- **Vectorization:** Using scikit-learn:  
  ```python
  from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
  vect = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
  X = vect.fit_transform(documents)  # documents: list of log messages
  ```
- **Word2Vec:** Gensim example:  
  ```python
  from gensim.models import Word2Vec
  tokenized = [doc.split() for doc in documents]
  w2v_model = Word2Vec(sentences=tokenized, vector_size=100, window=5, min_count=5, workers=4)
  vec = w2v_model.wv['error']  # get vector for word "error"
  ```
- **Fine-tuning BERT:** Using HuggingFace Trainer:  
  ```python
  from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
  tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
  model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=num_classes)
  train_args = TrainingArguments(output_dir="bert_logs", num_train_epochs=3, per_device_train_batch_size=8)
  trainer = Trainer(model=model, args=train_args, train_dataset=train_dataset, eval_dataset=val_dataset)
  trainer.train()
  ```  
- **Sentence Transformers:** Example for semantic search (using [SBERT](https://www.sbert.net/) library):  
  ```python
  from sentence_transformers import SentenceTransformer, util
  embedder = SentenceTransformer("all-MiniLM-L6-v2")
  corpus_embeddings = embedder.encode(log_texts, convert_to_tensor=True)
  query_embedding = embedder.encode("SSH brute force attack", convert_to_tensor=True)
  hits = util.semantic_search(query_embedding, corpus_embeddings, top_k=5)
  ```
    

## Project Timeline and Milestones  
We plan a 15-week timeline (15 instructional weeks) divided into milestones:

| Weeks | Tasks / Milestones                 | Deliverables                    |
|-------|------------------------------------|---------------------------------|
| 1–2   | **Project Setup:** Data collection (download datasets), define schemas, set up code repo and CI. | Data inventory, schema documentation, GitHub repo with initial structure. |
| 3–4   | **Preprocessing Pipeline:** Implement ingestion and parsing (regex, tokenization). | Prototype API for log ingestion, preprocessed log output. |
| 5–6   | **Feature Extraction:** Implement TF–IDF and Word2Vec features; initial data exploration. | Feature pipeline code, feature datasets. |
| 7–8   | **Baseline Classification:** Train simple ML models (LogReg, RF) on labeled logs. | Classification model report (accuracy/F1), confusion matrix. |
| 9–10  | **Transformer Models:** Fine-tune BERT (or similar) for log classification. Tune hyperparameters. | Improved classification results (tabulated), saved model. |
| 11    | **NER Module:** Build NER (spaCy pipelines or regex); extract IPs, users. | NER output examples, precision/recall on entity tags. |
| 12    | **Summarization:** Fine-tune BART/T5 on log-summary data (or try pretrained). Evaluate using ROUGE. | Summarization outputs, ROUGE scores. |
| 13    | **Similarity Search:** Implement sentence-transformers semantic search; demo retrieval. | Demo of query-response (e.g. “show similar incidents”), evaluation of retrieval. |
| 14    | **Integration:** Combine modules into one pipeline/API. Develop simple UI (dashboard of results). | Integrated system demo, API specs. |
| 15    | **Finalization:** Testing, documentation, slide deck and demo preparation. | Final report, README, slides, presentation. |

*Table 4: Project timeline (MVP features). Advanced features (e.g. real-time streaming, API refinements) can be slotted after core functionality is complete.*  

Milestones will be presented as intermediate deliverables (e.g. a week 8 report on classification models, week 12 demo of summarization).  

## Documentation, Demo and Presentation  
We will write clear documentation (README, code comments, architecture diagrams) so others can reproduce results. The demo plan includes:  
- **Live API demo:** Show uploading a log snippet and displaying classification, entities, summary.  
- **Web dashboard:** Display charts (e.g. log counts by type, word clouds).  
- **Slides:** Outline problem, system design (with architecture diagram), datasets, results (tables/charts), and conclusions.  

## Risks, Privacy and Ethics  
- **Privacy:** Logs often contain sensitive data (IPs, user names). We will anonymize or use synthetic data for public demos. Any real logs used internally will have sensitive fields masked.  
- **Bias & Errors:** Classification models might mislabel events (e.g. benign vs malicious). We must review outputs to avoid false alerts. Transparency (confidence scores) will help.  
- **Overfitting:** With limited labeled data, high-capacity models (BERT) may overfit. We will use validation sets and regularization (dropout). Baselines help detect overfitting.  
- **Security:** As a security tool, Argus itself should be secure. The system will not send data to external APIs (no closed-source LLM calls) to avoid leaks.  
- **Ethical Use:** Argus is a tool for defenders. We note that adversaries might also use NLP tools; responsible usage means respecting privacy and compliance (GDPR).  

## References  
We have drawn on official and academic sources throughout. For example, event log analysis challenges and LLM benefits are discussed in recent surveys. Public log datasets are catalogued in LogHub and AWS documentation. Key NLP methods (Word2Vec embeddings, semantic search, BART summarization) are documented in Gensim tutorials, Hugging Face model cards and docs.  Evaluation metrics like precision/recall/F1 and ROUGE are standard in ML/NLP. These and other sources (cited above) justify our design decisions and ensure Argus uses state-of-the-art techniques.  

 *Semantic search embedding illustration (from Sentence-Transformers documentation). Documents and queries are encoded into a vector space and similar items are retrieved by cosine similarity.*