# QRify

## Summary

Simple QR Code generator for any provided URL

Technical stack: 

[![Stack](https://skillicons.dev/icons?i=ts,nextjs,tailwind,mongodb)](https://skillicons.dev)

## Setup and run locally

To run the application correctly, create a ```.env``` file in the ```qr-generator``` directory and add the following variables:
```
MONGODB_URI - your local MongoDB URI
BASE_URL - protocol + your machine IP + port (e.g. http://192.168.x.x:3000)
QR_API_URL - QRCode Monkey API (https://api.qrcode-monkey.com/qr/custom)
JWT_SECRET - A secret key used to sign and verify JWT (JSON Web Tokens) for authentication
GOOGLE_CLIENT_ID - Obtained from the Google Cloud Console when you register your application
GOOGLE_CLIENT_SECRET - A secret key provided by Google when you register your application
```

In dev mode
```
cd qr-generator/ && npm i && npm run dev
```

## Website

Link to the web page:

[https://qrify-it.vercel.app/](https://qrify-it.vercel.app/)

##

LinkedIn: [Dmitrii Nikiforov](https://www.linkedin.com/in/dmitriinikiforov/)
