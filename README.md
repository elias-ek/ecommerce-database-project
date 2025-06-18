# Ecommerce database
This collaborative project was conducted along with three other students as part of a course on data modeling and database systems. The main focus of the task was to design and implement the database, with additional requirements for including a functional front- and backend for the site. The database is implemented using SQL in MariaDB, with a Python + Flask backend, and a React frontend.

# My Contribution
The database was designed collaboratively, with team-wide discussions about how the database should be designed and imlemented. Additionally, I created the frontend using React.js, with Vite as the build- and development tool, as well as react-router-dom for handling the routing of the website.

# Installation and Usage
## Dependencies
### Backend Dependencies
  - Python 3.12.9 (potentially works on other versions)
  - Flask - `pip install flask`
  - Flask Cors - `pip install flask-cors`
The current backend setup requires the database to be named *ecommercedatabase*, and the database to be hosted locally. The SQL scripts used to initialize the database are included, and should be aboe to run on any database management system, but we used MariaDB.
### Frontend Dependencies  
  - Node.js
  - React.js
  - react-router-dom
All dependencies can be installed by starting a terminal in the frontend directory and writing `npm install`.
The frontend was run during development through the npm local development server.

## Setup
### Database Setup
- Start XAMPP, run the Apache server and MariaDB
- Navigate to phpmyadmin and create a new database with the name "ecommercedatabase"
- Import the schema.sql file, or manually input the creation.sql and population.sql scripts.
### Backend Setup
- Start a terminal in the backend directory
- Run the program - `python ./app.py`
- The backend runs at localhost, port 5000
### Frontend setup
- Navigate to the frontend directory with terminal
- Run the development server with `npm run dev`
- The website runs on localhost, port 5173

## Usage / Functionality
Use the navbar at the top to access the different pages.
  - Products
      - Displays the products available at the site
      - Click 'add to cart' to add the product to cart
      - Click 'details' to see detailed product information
  - Register
      - Input user details and click 'register'
      - text appears to notify user about successful account creation
   - Cart
       - Remove a specific product by clicking the 'X' button of the product
       - Remove everything by pressing 'clear cart'
       - Check out by clicking 'go to checkout'
  - Checkout
      - Input username and password and choose payment method
      - Press 'subimt'; text will notify the user that the purchase was complete, and an entry will be added         to the database.   
