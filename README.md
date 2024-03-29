# Project Name

Enamad Crawler
## Overview
This project aims to create a backend system using Node.js to scrape information from websites listed on Enamad, store this information in a MongoDB database, and provide GraphQL APIs to retrieve and filter this data. Additionally, the project includes functionality to count the number of websites in each city and group websites based on their star ratings.

### Features
- **Web Scraping:** Utilizes web scraping techniques to extract information about companies from various websites.
- **MongoDB Integration:** Stores scraped company data in a MongoDB database for persistence.
- **GraphQL APIs:** Implements GraphQL APIs to provide flexible and efficient querying of company data.
- **Data Filtering:** Provides APIs to filter company data based on various criteria such as location, stars, etc.
- **City-wise Company Count:** Includes functionality to calculate the number of companies in each city.
- **Grouping by Star Ratings:** Allows grouping of companies based on their star ratings to provide insights into the distribution of highly-rated companies.

## Technologies Used
- Node.js
- Typescript
- MongoDB
- GraphQL


## Installation
1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Install dependencies:
    ```bash
    cd company-directory-backend
    npm install
    ```
3. Configure MongoDB:
   - Install MongoDB and ensure it is running on your system.
   - If necessary, update the MongoDB connection URL in `src/index.js`.


## Usage
1. Start the server:
    ```bash
    npm start
2. Access GraphQL APIs at http://localhost:3000/graphql.
