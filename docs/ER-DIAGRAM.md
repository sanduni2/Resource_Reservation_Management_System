# Resource Reservation ER Diagram

```mermaid
erDiagram
    RESOURCE ||--o{ RESERVATION : has

    RESOURCE {
        string id PK
        string name
        string type
        string location
        int capacity
        boolean isActive
        datetime createdAt
    }

    RESERVATION {
        string id PK
        string resourceId FK
        string date
        string startTime
        string endTime
        string purpose
        string reservedBy
        string status
        datetime createdAt
    }
```

A resource can have many reservations. Each reservation belongs to exactly one resource. The application checks the resource, date, and time range before creating a reservation to prevent overlapping bookings.
