## Backend endpoints

QR Code Generator

- Endpoint: POST /api/qr/generation
- Description: Generates a QR code with a unique tracking URL

Example of successful response:

```
{
  "status": 200,
  "headers": {
    "Content-Type": "image/svg+xml",
    "X-Tracking-Id": "c2a3f3fc-79c4-41d8-9654-3f7e8a0b1234"
  },
  "body": "<svg><!-- QR Code SVG Data --></svg>"
}
```

Save QR Code

- Endpoint: POST /api/qr/history
- Saves a QR code entry to the database

Example of successful response:

```
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "trackingId": "c2a3f3fc-79c4-41d8-9654-3f7e8a0b1234",
    "url": "https://example.com",
    "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAAUA", // (Base64-encoded string)
    "showInHistory": true,
    "_id": "64d1f58e8f8b7a001f25abcd",
    "__v": 0
  }
}
```

Fetch QR Codes

- Endpoint: GET /api/qr/history
- Retrieves QR codes visible in history from the database

Example of successful response:

```
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": [
    {
      "url": "https://example.com",
      "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAAUA", // (Base64-encoded image data)
      "createdAt": "2025-01-08T14:25:43.511Z",
      "scans": 12
    },
    {
      "url": "https://another-example.com",
      "qrCode": "iVBORw0KGgoAAAANSUhEUgAAAAUA", // (Base64-encoded image data)
      "createdAt": "2025-01-07T10:12:30.123Z",
      "scans": 5
    }
  ]
}
```

Redirect QR Code

- Endpoint: GET /redirect/[id]
- Retrieves a QR code by tracking ID, increments amount of scans and redirects to its URL

Example of successful response:

```
{
  "status": 302,
  "headers": {
    "Location": "https://example.com"
  },
  "body": null
}
```

Google OAuth Initialize

- Endpoint: GET /api/auth/google
- Initiates Google OAuth authentication flow

Example of response:

```
{
  "status": 302,
  "headers": {
    "Location": "https://accounts.google.com/o/oauth2/v2/auth..."
  }
}
```

Google OAuth Callback

- Endpoint: GET /api/auth/google/callback
- Handles OAuth callback from Google

Example of response:

```
{
  "status": 302,
  "headers": {
    "Location": "/",
    "Set-Cookie": "auth_token=..."
  }
}
```

Email Authentication

- Endpoint: POST /api/auth
- Handles login and registration

Example of response:

```
{
  "status": 200,
  "body": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

Logout

- Endpoint: DELETE /api/auth
- Logs out current user

Example of response:

```
{
  "status": 200,
  "body": {
    "success": true
  }
}
```