# FastAPI Feature Flag Integration Demo

This example demonstrates how an external FastAPI application can integrate with the Application Feature Planning & Release Governance System using the reusable FeatureFlagClient.

## Architecture

External FastAPI Application
        |
        v
FeatureFlagClient
        |
        v
POST /evaluate/
        |
        v
Feature Flag Evaluation Engine
        |
        +---- Redis Cache
        |
        +---- Database
        |
        v
Evaluation Result

## Prerequisites

- Python 3.11+
- Main Feature Flag Management System running
- Redis/Memurai running
- Required Python dependencies installed

## Step 1: Start the Feature Flag System

From the backend directory:

```bash
uvicorn app.main:app --reload