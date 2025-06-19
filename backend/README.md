# 🌱 **Cilantro vs. Perejil Classifier API**

# 1. 📋 **User Stories – Feature Roadmap**

## **MVP (Minimum Viable Product)**

**US1:** _As a user, I want to upload an image from my device or camera, so that the system can classify it as cilantro or perejil._

**US2:** _As a user, I want to instantly see the classification result (cilantro/perejil + confidence) after uploading an image._

**US3:** _As a developer, I want all uploaded images to be securely stored in S3, so I can audit and retrain models later._

**US4:** _As a developer, I want a health-check endpoint to ensure the API is up and the model is loaded._

---

## **MBI 1 (Minimum Business Increment 1)**

**US5:** _As a user, I want to provide feedback/correction on the prediction, so the system can learn from mistakes._

**US6:** _As an admin, I want to browse classified images and feedback, so I can identify common errors or edge cases._

---

## **MBI 2**

**US7:** _As a user, I want to see a simple history of my last few classifications, so I can track past uploads._

**US8:** _As an admin, I want to download misclassified images in bulk, so I can use them for model retraining._

---

## **MBI 3**

**US9:** _As a developer, I want the system to emit events (e.g., “ImageClassified”, “FeedbackReceived”) for integrations, analytics, or ML retraining pipelines._

**US10:** _As a developer, I want to support additional plant types (modular extensibility), so we can expand the product to other classification problems._

---

# 2. 🏗️ **Project Module Structure (Domain-Driven, Modular Monolith)**

```
app/
│
├── main.py
├── core/                      # Cross-cutting concerns (config, db, s3, events, auth)
│   ├── config.py
│   ├── db.py
│   ├── s3.py
│   ├── events.py
│   └── __init__.py
│
├── modules/
│   ├── classification/        # DOMAIN: Classification context
│   │   ├── api.py             # FastAPI routers/controllers
│   │   ├── service.py         # Application/service layer
│   │   ├── domain.py          # Domain models/entities/aggregates
│   │   ├── repository.py      # Infrastructure access (S3, db)
│   │   ├── schemas.py         # Pydantic models (DTOs)
│   │   └── __init__.py
│   │
│   ├── feedback/              # DOMAIN: Feedback context
│   │   ├── api.py
│   │   ├── service.py
│   │   ├── domain.py
│   │   ├── repository.py
│   │   ├── schemas.py
│   │   └── __init__.py
│   │
│   ├── dataset/               # DOMAIN: Dataset management
│   │   ├── api.py
│   │   ├── service.py
│   │   ├── domain.py
│   │   ├── repository.py
│   │   ├── schemas.py
│   │   └── __init__.py
│   │
│   └── __init__.py
│
├── shared/                    # Shared kernel (if needed)
│   ├── models.py
│   ├── utils.py
│   └── __init__.py
│
└── __init__.py
```

**Patterns used:**

- **Domain-Driven Design:** Each module = a bounded context/domain (classification, feedback, dataset)
- **Hexagonal/Onion Layering:** API → Service (App) → Domain → Repository (Infra)
- **Dependency Injection:** Via FastAPI’s `Depends`
- **DTOs:** Pydantic for API/data boundaries

---

# 3. 🧑‍💻 **Tech Stack**

- **Backend:** Python 3.11+, FastAPI
- **ML Inference:** Your ML model (Torch/TensorFlow/ONNX, etc.)
- **Storage:** S3 for images, PostgreSQL/SQLite for metadata/feedback
- **Frontend:** React (already in place)
- **Cloud:** AWS S3, (optional for future: AWS SQS/EventBridge for events)
- **Testing:** Pytest
- **CI/CD:** GitHub Actions, Docker

---

# 4. 🧱 **MVP Architecture (Diagram)**

**Frontend (React)**
⬇️
**FastAPI (API)**
⬇️
**ML Model (Loaded at startup)**
⬇️
**S3 (Image storage)**
⬇️
**(Optional: SQL DB for feedback, admin features)**

---

# 5. 🚀 **Future Improvements & Patterns**

### **Event Outbox Pattern (MBI 3)**

- When an event occurs (e.g., image classified, feedback received), write the event to an outbox table in your DB (transactionally with other changes)
- A background process/service polls the outbox and emits the event to a message broker (SQS, Kafka, etc.) for integrations, analytics, or ML retraining pipelines
- Guarantees reliable, eventually consistent event delivery

### **Extensibility**

- You can add new “plants” by extending the domain layer and updating the ML model—modular DDD supports this
- Each module can evolve independently (possible to split into microservices in the future if needed)

---

# 6. **Summary Table**

| Feature                     | MVP | MBI 1 | MBI 2 | MBI 3 |
| --------------------------- | --- | ----- | ----- | ----- |
| Image upload & classify     | ✅  |       |       |       |
| Classification result       | ✅  |       |       |       |
| S3 image storage            | ✅  |       |       |       |
| Health check                | ✅  |       |       |       |
| Feedback/correction         |     | ✅    |       |       |
| Admin browse images         |     | ✅    |       |       |
| User classification history |     |       | ✅    |       |
| Admin download images       |     |       | ✅    |       |
| Event outbox/integration    |     |       |       | ✅    |
| New plant types             |     |       |       | ✅    |

---

# 7. **Example MVP Flow**

- **React**: User uploads an image
- **FastAPI `/classify`**: Receives, stores image in S3, runs inference, returns result
- **FastAPI `/health`**: Ready for monitoring
- (Optional) Store basic prediction metadata for audit
