# Your-Gadgets-Server

## Installation:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Rename `.env.example` to `.env`.
4. Run the server using `npm run dev`.

## Configuration:

- Environment Variables:
  - `PORT`: Port number the server listens on. Default: 5000
  - `MONGODB_URI`: URI for MongoDB database.

## Usage:

- API Endpoints:

  - Getting all products (Filtering and sorting also)
    - GET `/api/v1/products`

  - Getting flash-sale products
    - GET `/api/v1/flash-sale`

  - Getting top products
    - GET `/api/v1/top-products`

  - Getting single product
    - GET `/api/v1/products/:id`

## Dependencies:

- `cors`: Express middleware for enabling CORS.
- `dotenv`: Loads environment variables from .env file.
- `express`: Web framework for Node.js.
- `mongodb`: MongoDB driver for Node.js.
- `nodemon`: Utility for automatically restarting the server during development.    
