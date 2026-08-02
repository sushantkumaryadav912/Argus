"""
MongoDB Document Schema: Notifications
Notifications live in MongoDB — not an SQLAlchemy model.
This file exists for documentation and import consistency.
"""
# Notification documents are stored in MongoDB collection 'notifications'
# Schema shape:
# {
#     "id": "NOTIF-001",
#     "title": "High-Frequency SSH BruteForce Detected",
#     "message": "Origin IP 198.51.100.42 reached 48 failed password attempts...",
#     "timestamp": "5 mins ago",
#     "severity": "critical",         # info | warning | error | critical
#     "read": false,
#     "category": "BruteForce Attack"
# }
