# Django Feature Flag Integration Demo

This example demonstrates how a Django application can integrate with the
Application Feature Planning & Release Governance System using the reusable
FeatureFlagClient.

## Architecture

Django Application
        |
        v
FeatureFlagClient
        |
        v
POST /evaluate/
        |
        v
Feature Flag Management System
        |
        +---- Redis Cache
        |
        +---- Database
        |
        v
Evaluation Result

## Start the Main Feature Flag System

From the backend directory:

```bash
uvicorn app.main:app --reload