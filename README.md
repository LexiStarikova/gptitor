# **GPTitor**

## Description
GPTitor is an interactive sandbox that helps users learn to write effective prompts for Large Language Models (LLMs). Users can select tasks, write prompts, and receive feedback and grades from different LLMs to improve their skills.

## Demo

The feedback window will provide you with all the necessary information, namely: the name and description of the task, the category, as well as the user's rating.

<img src="https://gitlab.pg.innopolis.university/a.nasibullina/gptitor/-/raw/main/Media/feedback_window.gif" height="600">

The chat allows you to send requests to the AI, as well as receive responses from it.

<img src="https://gitlab.pg.innopolis.university/a.nasibullina/gptitor/-/raw/main/Media/chat.gif" height="600">

Users can practice working with hints using categorized tasks, instantly receiving feedback and tips for improving the query.

<img src="https://gitlab.pg.innopolis.university/a.nasibullina/gptitor/-/raw/main/Media/tasks.gif" height="600">

Each chat has a history, which allows the user to return to the previous request.

<img src="https://gitlab.pg.innopolis.university/a.nasibullina/gptitor/-/raw/main/Media/history.gif" height="600">

Demonstration of the GPTitor.

<img src="https://gitlab.pg.innopolis.university/a.nasibullina/gptitor/-/raw/main/Media/feedback_demo.gif" height="600">

![Screenshot of GPTitor Chat Interface](http://10.100.30.244:8801/gptitor/chatpage)
![Watch Demo Video](http://10.100.30.244:8801/gptitor/chatpage)

## How to Use
1. Open the [GPTitor](http://10.100.30.244:8801/gptitor/chatpage) web application.
2. Choose a task from the list provided.
3. Write a prompt for the task and submit it.
4. Review the feedback and grading based on the prompt evaluation criteria.
5. Adjust the prompt based on feedback and resubmit to see improvements.
6. Switch between different LLMs to practice and compare responses.

## Features
- Interactive chatbot interface.
- Task selection for targeted prompt writing practice.
- Prompt grading based on specific evaluation criteria.
- Feedback on areas for improvement.
- Option to switch between different LLMs for diverse practice.

## Project Installation / Deployment
### Prerequisites
- Node.js and npm installed.
- Python 3.9 installed.

### Installation
1. Clone the repository:
    ```bash
    git clone https://gitlab.pg.innopolis.university/a.nasibullina/gptitor.git
    cd gptitor
    ```
2. Install frontend dependencies:
    ```bash
    cd React
    npm install
    ```
3. Install backend dependencies:
    ```bash
    cd ../API
    pip install -r requirements.txt
    ```

### Deployment
1. Start the frontend application:
    ```bash
    cd React
    npm start
    ```
2. Run the backend API using uvicorn:
    ```bash
    cd ../API
    uvicorn Core.main:app --reload
    ```
 
### Note on Deployment
- The service is currently available only within the Innopolis network. 
- If you wish to deploy the service elsewhere, ensure to update links in the React files and API requests accordingly.
- You may access the API documentation (Swagger UI) at http://127.0.0.1:8000/docs in your web browser after the deployment.
- The public API documentation (Swagger UI) is available [here](http://10.100.30.244:8000/docs).
- LLMs are hosted on remote servers; the API interacts with these servers.


## Frameworks and Technology
- **Frontend**: React, CSS, TypeScript
- **Build Tool**: Vite
- **Backend**: FastAPI
- **Database**: SQLite
- **Deployment**: npm, Uvicorn

## Using Docker Compose

To simplify the development and deployment of your application, you can use Docker Compose. Below are the instructions on how to set up and run your application using Docker Compose.

### Prerequisites

Make sure you have Docker and Docker Compose installed on your machine. You can download them from the official Docker website.

### Docker Compose Setup

1. **Clone the Repository**

   ```sh
   git clone https://gitlab.pg.innopolis.university/a.nasibullina/gptitor.git
   cd gptitor
   ```

2. **Build and Run Containers**

   Navigate to the root directory of your project where `docker-compose.yml` is located and run the following command:

   ```sh
   docker-compose up --build
   ```

   This command will build the Docker images for the backend and frontend services and start the containers.

3. **Access the Application**

   - The backend will be accessible at `http://localhost:8000`
   - The frontend will be accessible at `http://localhost:5173`

4. **Stopping the Containers**

   To stop the containers, press `CTRL+C` in the terminal where `docker-compose up` is running or use the following command:
  
   ```sh
   docker-compose down
   ```

5. **Testing and Linting**

  To run linting and testing using Docker Compose, use the following commands:
  - Run Backend Linting with Flake8:
  ```sh
   docker-compose run --rm lint_backend
   ```
   - Run Frontend Linting with ESLint:
  ```sh
   docker-compose run --rm lint_frontend
   ```
   - Run Backend Test with Pytest:
  ```sh
   docker-compose run --rm test_backend
   ```
  - Run Frontend Test with Jest:
  ```sh
   docker-compose run --rm test_frontend
   ```
   The results

## Setting Up GitLab CI/CD Pipeline

To automate the build, test, and deployment process, you can use GitLab CI/CD. Below are the instructions to set up the GitLab CI/CD pipeline.

### Prerequisites

Make sure you have a GitLab account and your project is hosted on GitLab.

### GitLab CI/CD Setup

1. **Add `.gitlab-ci.yml` to Your Repository**

   Ensure that your `.gitlab-ci.yml` file is located in the root directory of your repository. Below is an example configuration for your pipeline:

   ```yaml
   stages:
     - build
     - lint
     - test
     - deploy

   build:
     stage: build
     script:
       - docker-compose -f docker-compose.yml build

   lint:
     stage: lint
     script:
       - docker run --rm -v $(pwd):/app -w /app gptitor_frontend npm run lint
       - docker run --rm -v $(pwd):/app -w /app gptitor_backend flake8 .

   test:
     stage: test
     script:
       - docker run --rm -v $(pwd):/app -w /app gptitor_backend pytest
       - docker run --rm -v $(pwd):/app -w /app gptitor_frontend npm test

   deploy:
     stage: deploy
     script:
       - echo "Deploy stage - Add your deployment commands here"
   ```

2. **Pipeline Stages**

   - **Build Stage:** Builds the Docker images for the backend and frontend services.
   - **Lint Stage:** Runs linting tools for the frontend and backend code.
   - **Test Stage:** Runs tests for the frontend and backend code.
   - **Deploy Stage:** Contains commands for deploying your application. You need to customize this according to your deployment strategy (e.g., deploying to a cloud provider, Kubernetes, etc.).

3. **Commit and Push Changes**

   After setting up the `.gitlab-ci.yml` file, commit and push the changes to your GitLab repository:

   ```sh
   git add .gitlab-ci.yml
   git commit -m "Add GitLab CI/CD configuration"
   git push origin main
   ```

   GitLab will automatically detect the `.gitlab-ci.yml` file and start the pipeline.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information
For any questions, issues, or contributions, you can reach out to the developers:
- **Alexandra Starikova-Nasibullina**
  - Email: [a.nasibullina@innopolis.university](mailto:a.nasibullina@innopolis.university)
  - Telegram: [@lexandrinnn_t](https://t.me/lexandrinnn_t)

- **Makar Dyachenko**
  - Email: [m.dyachenko@innopolis.university](mailto:m.dyachenko@innopolis.university)
  - Telegram: [@index099](https://t.me/index099)

- **Anas Hamrouni**
  - Email: [a.hamrouni@innopolis.university](mailto:a.hamrouni@innopolis.university)
  - Telegram: [@reachnasta](https://t.me/reachnasta)

- **Ahmed Baha Eddine Alimi**
  - Email: [a.alimi@innopolis.university](mailto:a.alimi@innopolis.university)
  - Telegram: [@Allimi3](https://t.me/Allimi3)

- **Ildar Rakiev**
  - Email: [i.rakiev@innopolis.university](mailto:i.rakiev@innopolis.university)
  - Telegram: [@mescudiway](https://t.me/mescudiway)

## Links