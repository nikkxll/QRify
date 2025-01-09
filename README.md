# QRify

## Summary

Simple QR Code generator for any provided URL

Technical stack: 
- Typescript
- NextJS
- TailwindCSS
- MongoDB
- QRCode Monkey API
- Render

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

Link to the web page:

https://qrify-56d0.onrender.com/

_Note: Initial loading may take 2-3 minutes. Refresh the page if necessary._

You may experience delays or failures due to API rate limits or processing time. If this occurs, please try again after 20-30 seconds or reload the page.

##

LinkedIn: [Dmitrii Nikiforov](https://www.linkedin.com/in/dmitriinikiforov/)
