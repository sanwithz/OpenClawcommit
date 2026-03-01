---
name: google-calendar
description: Manage Google Calendar - create events, check schedule, cancel appointments. Use when user wants to add events to calendar, check their schedule, or manage calendar appointments.
---

# Google Calendar Skill

## Setup Required

1. Go to https://console.cloud.google.com/
2. Create project → Enable Google Calendar API
3. Create OAuth 2.0 credentials → Download client_secret.json
4. Run authorization flow to get refresh token

## Environment Variables

```bash
export GOOGLE_CALENDAR_CLIENT_ID="your-client-id"
export GOOGLE_CALENDAR_CLIENT_SECRET="your-client-secret"
export GOOGLE_CALENDAR_REFRESH_TOKEN="your-refresh-token"
export GOOGLE_CALENDAR_TIMEZONE="Asia/Bangkok"
```

## Quick Start

```python
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import os

# Build credentials from refresh token
creds = Credentials(
    token=None,
    refresh_token=os.getenv('GOOGLE_CALENDAR_REFRESH_TOKEN'),
    token_uri='https://oauth2.googleapis.com/token',
    client_id=os.getenv('GOOGLE_CALENDAR_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CALENDAR_CLIENT_SECRET')
)

service = build('calendar', 'v3', credentials=creds)
```

## Common Operations

### Create Event
```python
event = {
    'summary': 'Meeting with Team',
    'location': 'Online',
    'description': 'Discuss Q1 goals',
    'start': {
        'dateTime': '2026-03-05T14:00:00',
        'timeZone': 'Asia/Bangkok',
    },
    'end': {
        'dateTime': '2026-03-05T15:00:00',
        'timeZone': 'Asia/Bangkok',
    },
    'reminders': {
        'useDefault': False,
        'overrides': [
            {'method': 'popup', 'minutes': 30},
        ],
    },
}

event = service.events().insert(calendarId='primary', body=event).execute()
print(f'Event created: {event.get("htmlLink")}')
```

### List Upcoming Events
```python
from datetime import datetime, timedelta

now = datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
events_result = service.events().list(
    calendarId='primary',
    timeMin=now,
    maxResults=10,
    singleEvents=True,
    orderBy='startTime'
).execute()

events = events_result.get('items', [])
for event in events:
    start = event['start'].get('dateTime', event['start'].get('date'))
    print(f'{start} - {event["summary"]}')
```

### Cancel/Delete Event
```python
service.events().delete(calendarId='primary', eventId='event_id_here').execute()
```

### Check Free/Busy
```python
body = {
    "timeMin": "2026-03-05T00:00:00Z",
    "timeMax": "2026-03-06T00:00:00Z",
    "items": [{"id": 'primary'}]
}

freebusy = service.freebusy().query(body=body).execute()
```

## Dependencies

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```