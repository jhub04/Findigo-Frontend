# E-commerce marketplace: Findigo
Findigo is a full-stack application developed with Vue.js and Spring Boot. 
The project was developed as the final assesment in the course IDATT2105 Fullstack-Applikasjonsutvikling
for the spring semester of 2025 at NTNU.

Link to the hosted Findigo: https://idatt2105-09.idi.ntnu.no 

**NB!** This repository contains the frontend source code. You can find the backend source code [here](https://github.com/jhub04/Findigo.git) 

## The team
- Aryan Malekian
- Scott Langum du Plessis
- Jonathan Skomsøy Hübertz
- Mikael Stray Frøyshov

## Table of contents
...

## Overview
The project is a full-stack web-application aiming to provide a user-friendly
e-commerce platform for users to buy, sell and look at items.

The project utilizes the following technologies:
- Frontend: Vue 3 with Node.js
- Backend: Springboot V3 with Maven and Java 21
- Database: MySQL V8 for runtime and H2 for tests

You can find the swagger API documentation [here] (add link to swagger docs)

## Features
- **Secure login:** Users can securely log in, register, and update their account details
- **Listing Creation:** Users can create listings and publish them to the marketplace
- **Archiving:** A user can archive his own listings, so that they're not available on the public marketplace
- **Favorite Selection:** Users can favorite listings they like or find interesting, and view all of them from the profile page 
- **Recommendation algorithm:** Listings on the homepage are filtered based on an advanced recommendation algorithm, and can be further filtered based on category.
- **Advanced search:** Users can search for listings and filter based on *category*, *price*, *location*, and the listing creation *date*
- **Map View:** Users get to see listings marked on a real map and filter them with advanced search
- **Messaging:** Users can send messages to each other to negotiate or inquire on listed items
- **Admin functionality:** Admin users can do administrate actions such as adding, modifying, and deleting categories and listings
- **Internationalization:** The application has support language support for English, Norwegian, Spanish, as well as Nepali and Urdu

More ...

## System Architecture
<img width="766" alt="Screenshot 2025-04-06 at 19 17 28" src="https://github.com/user-attachments/assets/7645299b-3fe0-474c-b22d-4bb96667d6af" />

## Setup for Development and Test Environments 
NB! See [Findigo-Backend](https://github.com/jhub04/Findigo.git) for how to run the backend

#### Prerequisites 
- Node.js 

### Setting up the development environment
Before compiling the frontend development environment make sure that the backend is using the dev spring profile. You can find more information about this [here](https://github.com/jhub04/Findigo/blob/master/README.md)

1. Clone the project
    ```bash
    git clone https://github.com/jhub04/Findigo-Frontend.git
    ```
2. Navigate to the project directory
   ```bash
   cd Findigo-Frontend
   ```
3. Install all dependencies
   ```bash
   npm install
   ```
4. Compile
   ```bash
   npm run dev
   ```

#### Admin user credentials (use on login)
- Username: admin
- Password: admin123

### Running Tests
Before running end-to-end tests with cypress you need to make sure that you backend is running with the using the test spring profile. You can find more information about this [here](https://github.com/jhub04/Findigo/blob/master/README.md)
 
To run the end-to-end tests you need to first run with test configuration:
```bash
npm run dev:test 
```

Then run:
```bash
npx cypress run
```

## Continuous Deployment
Findigo is deployed at https://idatt2105-09.idi.ntnu.no, hosted on a dedicated virtual machine within the NTNU network. The application will remain online until the administrator at NTNU shuts it down.

#### <u>Hosting Environment</u>
The project is deployed on an Ubuntu-based virtual machine using the following stack:
- Backend: Spring Boot (Java 21, Maven)
- Frontend: Vue 3 (Vite)
- Database: MySQL 8
- Web Server / Reverse Proxy: Nginx
- Deployment Automation: GitHub Actions (CI/CD)



#### <u>Self-hosted runners</u>
We created self-hosted runner for both of the repos, so that it was possible to communicate with the NTNU virtual machine from Github.
The continuous deployment workflows were configured to:
- Backend: Build the backend application into a self-contained JAR and set up a systemd service for automatic startup and easier management.
- Frontend: Deployed the static build files to Nginx's root directory.  





