# qrify

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

In dev mode
```
npm i && npm run dev
```

To run the application correctly, create a ```.env``` file in the ```qr-generator``` directory and add the following variables:
```
MONGODB_URI - your MongoDB URI
BASE_URL - your machine IP + port (e.g. 192.168.x.x:3000)
QR_API_URL - QRCode Monkey API (https://api.qrcode-monkey.com/qr/custom)
```

Link to the web page:

https://qrify-56d0.onrender.com/

_Note: Initial loading may take 2-3 minutes. Refresh the page if necessary._

You may experience delays or failures due to API rate limits or processing time. If this occurs, please try again after 20-30 seconds or reload the page.

##

LinkedIn: [Dmitrii Nikiforov](https://www.linkedin.com/in/dmitriinikiforov/)
