# **GPTitor**

## Description
GPTitor is an interactive sandbox that helps users learn to write effective prompts for Large Language Models (LLMs). Users can select tasks, write prompts, and receive feedback and grades from different LLMs to improve their skills.

## Demo
The following GIF shows the key idea of GPTитор in practice:
<img src="https://gitlab.pg.innopolis.university/a.nasibullina/gptitor/-/raw/main/Media/Demo.gif" height="400">

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

## Using Docker Compose [For Customers]

To simplify the development and deployment of your application, you can use Docker Compose. Below are the instructions on how to set up and run your application using Docker Compose.

### Prerequisites

Make sure you have Docker and Docker Compose installed on your machine. You can download them from the [official Docker website](https://www.docker.com/).

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

## Setting Up GitLab CI/CD Pipeline

To automate the build, test, and deployment process, you can use [GitLab CI/CD](https://docs.gitlab.com/ee/ci/). The following guidance is applicaple only for the Innopolis University community. Below are the instructions to set up the GitLab CI/CD pipeline.

### Prerequisites

- Ensure you have access to the Innopolis University GitLab instance.
- Make sure you have the necessary credentials to work in Innopolis University DevOps Playground.

### Configuration

The CI/CD pipeline configuration is specified in the [`.gitlab-ci.yml`](.gitlab-ci.yml) file. This configuration includes the following stages:

   - **Build Stage:** Builds the Docker images for the backend and frontend services.
   - **Lint Stage:** Runs linting tools ESLint and Flake8 for the frontend and backend code.
   - **Test Stage:** Runs tests for the frontend and backend code using Jest and Pytest respectively.
   - **Deploy Stage:** Contains commands for deploying the application. You need to customize this according to the deployment strategy (e.g., deploying to a cloud provider, Kubernetes, etc.).

### Running the Pipeline

To start the CI pipeline, refer to the tutorial shared in the Innopolis University GitLab repository [here](https://gitlab.pg.innopolis.university/n.askarbekuly/demo_docker_ci_cd/-/blob/master/README.md).

### Additional Notes

- Ensure all required environment variables are set correctly in your GitLab CI/CD settings.
- This pipeline is configured to work specifically for the Innopolis University environment.

## Detailed Documentation [For Customers]

For more comprehensive details on the API, DB, and React components structure, please refer to the following documents:

- [API Documentation](API/README.md): This document provides detailed information about the API endpoints, data formats, database structure, and usage instructions.

- [React Components Documentation](React/README.md): Here you can find comprehensive descriptions for the React components implemented in this project.
 

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