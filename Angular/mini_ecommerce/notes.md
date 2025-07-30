#  MEAN Stack Setup Instructions
installing node current version
create a folder for backend
move to backend folder and give npm i nodemon
create app.js file
use npm i express in backend folder

# Configuration for variables
create a config folder
npm i dotenv - install dotenv
create a config.env file
add PORT=8000
add NODE_ENV=production

# Creating routes and controllers
create a routes folder in backend
create a file called products.js in routes folder
create a controllers folder in backend
create a file called productController.js in controllers folder

# Testing the API routes with thunder client
create 3 request for each routes

# Connecting Database
install Mongo DB community version
install compass in Mongo DB page 
npm i mongoose

# creating product model
create a models folder in backend
create a file called productModel.js in models folder
add the schema for product
export the model

# Building GET products model
go to productController.js
import the product model    
use async function to fetch products
use await productModel.find({})