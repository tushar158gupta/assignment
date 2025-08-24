Affiliate Postback System MVP
System Overview
This project is a minimal viable product (MVP) of an affiliate marketing postback system. It demonstrates the core logic for Server-to-Server (S2S) tracking, where a conversion is reported directly from an advertiser's server to an affiliate's server.

The application is a full-stack project with a clear separation of concerns:

Backend: A Node.js and Express server that handles all API requests and database interactions with PostgreSQL.

Frontend: A Next.js application that serves as the affiliate dashboard and communicates with the backend via HTTP requests.

The system includes three key components:

Click Tracking Endpoint: Logs user clicks from a unique tracking link, backed by a PostgreSQL database.

Postback Endpoint: Receives and validates conversion data from an advertiser, linking it to a previously logged click in the database.

Affiliate Dashboard: A simple user interface where affiliates can view their logged clicks and successful conversions.

Features & Requirements
The application meets the following user stories and technical requirements:

Click Tracking: The system can receive and store click events with affiliate_id, campaign_id, and a unique click_id.

Postback Endpoint: It validates incoming postbacks against existing clicks and logs conversions. It returns a JSON response indicating success or failure.

PostgreSQL Database Schema: The code logic is designed to interact with a database following this schema: affiliates, campaigns, clicks, and conversions.

Affiliate Dashboard: The frontend displays a simulated login and shows the clicks and conversions for the chosen affiliate.

Unique Postback URL: Affiliates can see the unique format of their postback URL, which includes their affiliate_id.

Getting Started
Prerequisites
Node.js (LTS version recommended)

npm (or yarn)

PostgreSQL (required to run the full-stack version)

1. Database Setup
   First, you need to set up your PostgreSQL database.

Create a new PostgreSQL database.

Use a PostgreSQL client (like psql or DBeaver) to connect to your new database.

Execute the SQL commands from the sql/init.sql file to create the necessary tables and populate them with sample data.

2. Backend Setup
   Next, set up the Node.js/Express backend.

Navigate to the backend directory: cd backend.

Install the required Node.js dependencies: npm install.

Create a .env file in the backend directory. Add your PostgreSQL connection string to this file, replacing the placeholder values.

Just run : "psql -U postgres -d postgres -f init.sql"

DATABASE_URL="postgres://postgres:{your password}@localhost:5432/postgres"

Start the backend server: npm run dev (for development with nodemon) or npm start. The server will run on http://localhost:4000.

3. Frontend Setup
   Finally, set up the Next.js frontend.

Navigate to the frontend directory: cd frontend.

Install the required dependencies: npm install.

Create a .env.local file in the frontend directory to tell the Next.js app where to find the backend. The default value is provided.

NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"

Start the Next.js development server: npm run dev. The frontend will be available at http://localhost:3000.

Example API Requests
Once both the backend and frontend are running, you can test the API endpoints directly.

Click Tracking:

GET http://localhost:4000/click?affiliate_id=1&campaign_id=101&click_id=abc123

Postback:

GET http://localhost:4000/postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD
