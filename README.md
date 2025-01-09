# QRify

## Summary

Simple QR Code generator for any provided URL

Technical stack: 

[![Stack](https://skillicons.dev/icons?i=ts,nextjs,tailwind,mongodb)](https://skillicons.dev)

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

## Setup and run locally

To run the application correctly, create a ```.env``` file in the ```qr-generator``` directory and add the following variables:
```
MONGODB_URI - your local MongoDB URI
BASE_URL - protocol + your machine IP + port (e.g. http://192.168.x.x:3000)
QR_API_URL - QRCode Monkey API (https://api.qrcode-monkey.com/qr/custom)
```

In dev mode
```
cd qr-generator/ && npm i && npm run dev
```

## Website

Link to the web page:

https://qrify-56d0.onrender.com/

_Note: Initial loading may take 2-3 minutes. Refresh the page if necessary._

You may experience delays or failures due to API rate limits or processing time. If this occurs, please try again after 20-30 seconds or reload the page.

##

LinkedIn: [Dmitrii Nikiforov](https://www.linkedin.com/in/dmitriinikiforov/)
