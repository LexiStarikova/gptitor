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


## Frameworks or Technology
- **Frontend**: React, CSS, TypeScript
- **Build Tool**: Vite
- **Backend**: FastAPI
- **Database**: SQLite
- **Deployment**: npm, Uvicorn

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