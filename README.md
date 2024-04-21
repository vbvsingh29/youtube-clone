# Full Stack Video Streaming Project

This is a full stack video streaming project where users can upload and stream videos. The videos are stored on AWS S3 bucket. The project uses various technologies for both the backend and frontend.

## Technologies Used

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB with Typegoose and Mongoose ORM
- Helmet for security
- Busboy for video streaming
- Zod for schema validation
- AWS SDK for storing videos on S3 bucket

### Frontend

- React.js
- React-Redux for managing authentication tokens
- Redux Persistent for managing store value after refresh

## Environment Variables

Make sure to set the following environment variables:

For Server Side

- `PORT`: Port number for the server
- `CORS_ORIGIN`: CLient Side Domain
- `DB_CONNECTION_STRING`: MongoDB connection URI
- `AWS_ACCESS_KEY_ID`: AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AWS_REGION`: AWS Region
- `AWS_BUCKET_NAME`: AWS S3 bucket name
- `JWT_SECRET`: Secret key for JWT token
- `EXPIRES_IN`: JWT expire time

For Client Side

- `REACT_APP_API_ENDPOINT`: Server Side endpoint to hit APIs
- `REACT_APP_AWS_ACCESS_KEY_ID`: AWS access key ID
- `REACT_APP_AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `REACT_APP_AWS_REGION`: AWS region
- `REACT_APP_AWS_BUCKET_NAME`: AWS S3 bucket name

## Authentication Method

After successful login, JWT token is generated and sent to the client. Subsequent requests to protected routes require this token to be included in the headers as the `Authorization` header. The server verifies the JWT token from the headers to authenticate the user.

## Redux Store and API Calls

The authentication token received upon successful login is stored in the Redux store. Any API calls that require authentication are made by including the JWT token in the headers as the `Authorization` header.
