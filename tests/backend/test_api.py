"""API Smoke Tests using FastAPI TestClient"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Argus Cybersecurity Log Analysis Platform"


def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "totalLogs" in data
    assert "classificationBreakdown" in data


def test_logs_endpoint():
    response = client.get("/api/logs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_notifications_endpoint():
    response = client.get("/api/notifications")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
