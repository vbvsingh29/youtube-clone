# YouTube Clone (Full-Stack Video Streaming)

A full-stack, secure video streaming clone of YouTube. Users can register accounts, upload videos, search public uploads, stream videos, and manage private uploads. Videos are processed and streamed securely from AWS S3, and metadata is stored in MongoDB.

---

## Key Enhancements & Showcase Features

*   **Hardened S3 Security:** The frontend client is completely decoupled from S3 keys. Temporary signatures are handled entirely on the backend server (`/api/videos/:videoId/thumbnail`), preventing raw credential exposure in client browser bundles.
*   **Cost Protection & S3 Limits:** Enforces a maximum file upload size of **10MB** and restricts users to a maximum of **5 uploaded videos** to remain within free tier limits.
*   **Video Privacy Toggles:** Unpublished videos are private; only the owner can query, view, or stream them. Published videos are public and display on the global landing page.
*   **Title Search:** Live-filtering search bar in the header querying database fields.

---

## Required Environment Variables (ENV Setup)

Create a `.env` file in both the `/client` and `/server` directories with the following configurations:

### 1. Server Environment Variables (`/server/.env`)
```env
PORT=5000
CORS_ORIGIN=http://localhost:1234
DB_CONNECTION_STRING=mongodb://localhost:27017/youtube-clone

# AWS S3 Configurations
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_REGION=your_aws_region_here (e.g., us-east-1)
AWS_BUCKET_NAME=your_s3_bucket_name_here

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
EXPIRES_IN=7d
```

### 2. Client Environment Variables (`/client/.env`)
```env
REACT_APP_API_ENDPOINT=http://localhost:5000
```
*(Note: Because of our security refactor, AWS keys are no longer required on the client side).*

---

## How to Run the Project Locally

Ensure you have Node.js and Yarn installed.

### Step 1: Run the Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the server in development mode:
   ```bash
   yarn dev
   ```
   The backend will start listening at `http://localhost:5000`.

### Step 2: Run the Frontend Client
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the bundler development server (uses Parcel):
   ```bash
   yarn start
   ```
   The frontend will open and run at `http://localhost:1234`.
