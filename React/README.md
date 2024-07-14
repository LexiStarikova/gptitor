
# Front-end

## Description

The directory includes 16 React component, each has its style sheet

## Directory structure

[TOC]

## Internal structure

- **App.tsx**
  - header.tsx
  - sidebar.tsx
  - **Chatpage:**
    - studymode.tsx
      - **conversationPanel.tsx**
        - queryComponent.tsx
        - likeicon.tsx
      - **feedbackPanel.tsx**
        - taskPanel.tsx
        - feedbackWindow.tsx
        - taskdescription.tsx
        - notstudymode.tsx

## Components documentation

### App.tsx

#### Description

This React component, `App`, serves as the main application for a conversational learning platform named GPTitor. It manages the overall application structure, routing, state management, and data fetching for conversations and feedback.

#### Main dependencies

`react-router-dom`: Provides routing functionalities for navigating between different components (`Router`, `Routes`, `Route`, `Navigate`)

`react`: Core React library (`useState`, `useContext`, `useEffect`, `useRef`)

`FeedbackContext`: Context object for sharing feedback and criteria data

`Sidebar`: Component responsible for displaying conversation history and actions

`NavBar`: Component rendering the header for the application

`StudyMode`: Component dedicated to handling the chat conversation and user interaction

`Profile`: Component for managing personal space

`Metrics`: Model class from `./models/metrics` for storing feedback criteria scores

`API_URL` constant containing the base URL for API requests

#### State variables

`convId`: Integer state variable to store the currently opened conversation ID

`queries`: Array state variable containing conversation objects with display ID, stored ID, and text for the sidebar

`nextId`: Integer state variable to keep track of the next available ID for new conversations

`responses`: Array state variable storing simplified message objects (ID and text) for responses

`requests`: Array state variable storing simplified message objects (ID and text) for user requests

`hasMounted`: Reference variable using `useRef` to track whether the component has mounted yet (for side effects)

#### Hooks

`useState`: Used to manage all the state variables mentioned above.

`useContext`: Used to access feedback and criteria data from the FeedbackContext

`useEffect`: Used for two purposes:

- Fetches conversation data on component mount and updates the `queries` state variable.
- Logs criteria updates for debugging purposes (`console.log`).

`useRef`: Creates a reference object to track whether the component has mounted (`hasMounted`)

#### Props

 (passed down to Sidebar component)

`CreateConversation`: Function prop for creating a new conversation

`openConversation`: Function prop for opening an existing conversation by ID

`deleteConversation`: Function prop for deleting a conversation

`requests`: Array prop containing user request messages

`responses`: Array prop containing response messages

`queries`: Array prop containing conversation objects for the sidebar

#### Fetched Data (utility & endpoints)

`Conversations`**:** Fetches conversation data (list of conversation objects) upon component mount from the `/conversations` endpoint of the API specified by `API_URL`.

`Conversation Messages`: Fetches messages for a specific conversation by ID from the `/conversations/{conversation_id}/messages` endpoint.

`Feedback`: Fetches feedback and criteria data for the last user request in the opened conversation from the `/feedback/{request_id}` endpoint.

#### Functions

`addQueries`: Processes fetched conversation data and updates the `queries` state variable.

`fetchDialogs`: Fetches conversation data and handles creating a new conversation if none exist.

`CreateConversation`: Makes a POST request to the `/conversations` endpoint to create a new conversation.

`openConversation`: Fetches conversation messages, parses them into separate response and request messages, and updates the corresponding state variables. It also fetches feedback data for the last request.

`deleteConversation`: Deletes a conversation by ID using a DELETE request and updates the `queries` state variable.

### header.tsx

#### Description

The `Header` component renders the application's header section. It typically includes a logo (as SVG) and EMOP services,

#### Main dependencies

`react`: The React library is required.

`./header.css`: This file contains the styles for the component.

#### State variables

The component doesn't use state variables

#### Hooks

The component doesn't use hooks

#### Props

The component does not accept props

#### Fetched data (utility & endpoints)

The `Header` component doesn't fetch data directly.

#### Functions

The component doesn't define any functions

### sidebar.tsx

#### Description

This React component renders a sidebar for a chat application. It displays conversation history, allows users to create new conversations, and provides access to user profile and help sections.

#### Main dependencies

`react`: The core React library for building user interfaces

`react-router-dom`: A library for routing within a React application (used for linking to profile and chat pages)

`./QueryComponent`: a custom component for displaying individual conversation queries

#### State variables

`selectedQueryId`: (number | null) This state variable stores the ID of the currently selected conversation query.

`sidebarVisible`: (boolean) This state variable tracks whether the sidebar is currently visible.

#### Hooks

`useState`: React Hook used for managing state variables (`selectedQueryId` and `sidebarVisible`).

`useEffect`: React Hook used for side effects in functional components. In this case, it sets the `selectedQueryId` to the ID of the latest query when the `queries` prop changes.

`useRef`: React Hook used to create a reference to a DOM element (for handling mouse leave events on the sidebar).

#### Props

`CreateConversation`: (function) A function that is called to create a new conversation.

`openConversation`: (function) A function that is called to open an existing conversation by its ID.

`deleteConversation`: (function) A function that is called to delete a conversation by its display ID and stored ID.

`requests`: (MessageSimplifyed[]) An array of message objects representing conversation requests.

`responses`: (MessageSimplifyed[]) An array of message objects representing conversation responses.

`queries`: ({ display_id: number; stored_id: number; text: string }[]) An array of objects representing conversation queries. Each object has properties for display ID, stored ID, and query text.

#### Fetched data (utility & endpoints)

This component does not directly fetch data from an external endpoint. It relies on props (`requests`, `responses`, and `queries`) to receive data from its parent component.

#### Functions

`toggleSidebar`: This function toggles the visibility of the sidebar by setting the `sidebarVisible` state variable.

`handleQuerySelection`: This function updates the `selectedQueryId` state variable when a conversation query is selected.

`handleCreateConversation`: This function calls the `CreateConversation` prop function to initiate creating a new conversation.

`handleMouseLeave`: This function hides the sidebar when the user's mouse leaves the sidebar area.



### studymode.tsx

#### Description

The `StudyMode` component renders a user interface for a study mode. It displays two main panels: conversationPanel and feedbackPanel

#### Main dependencies

`react`: The core React library for building user interfaces

`./conversationPanel`: A custom component for displaying conversation history and managing requests/responses.

`./feedbackPanel`: A custom component for handling user feedback.

`./taskdescription` : A custom component for displaying task descriptions.

`useState` hook from `react`: Used for managing component state.

#### State variables

`isSidebarOpen` (boolean): This variable tracks whether the task panel is currently visible.

`showDescription` (boolean): This variable tracks whether the task description panel is currently visible.

#### Hooks

`useState`: Used to manage the state variables `isSidebarOpen` and `showDescription`.

#### Props

`requests` (MessageSimplifyed[]): An array of message objects representing conversation requests.

`setRequests` (React.Dispatch<React.SetStateAction<MessageSimplifyed[]>>): A function to update the `requests` state.

`responses` (MessageSimplifyed[]): An array of message objects representing conversation responses.

`setResponses` (React.Dispatch<React.SetStateAction<MessageSimplifyed[]>>): A function to update the `responses` state.

`conversation_id` (number): The ID of the current conversation.

#### Fetched data (utility & endpoints)

This component does not directly fetch data from an external endpoint. It relies on props (`requests`, `responses`, and data used in `TaskDesc`) to receive data from its parent component.

#### Functions

`toggleSidebar`: This function toggles the visibility of the task panel by setting the `isSidebarOpen` state variable.

`toggleDescription`: This function toggles the visibility of the task description panel content by setting the `showDescription` state variable.



### conversationPanel.tsx

#### Description

The ConversationPanel component is a reusable component that displays a conversation between a user and a conversational AI model. It allows users to input prompts and see responses from the model. It also allows users to provide feedback on the model's responses.

#### Main dependencies

`react`: The core React library for building user interfaces.

`useState`: React Hook for managing component state.

`useRef`: React Hook for creating mutable ref objects.

`useEffect`: React Hook for performing side effects in functional components.

`useContext`: React Hook for accessing context values from a parent component.

`ReactLoading`: A third-party library for displaying a loading indicator.

`./feedbackContext`: (assumed) A custom context that provides methods for managing feedback state.

`./models/metrics`: (assumed) A file containing the `Metrics` class used for representing conversation metrics.

`./conversationPanel.css`: The stylesheet containing CSS classes used by the component.

#### State variables

`text`: (string) Stores the text entered by the user in the message composition area.

`loading`: (boolean) Indicates whether the component is fetching data or not.

#### Hooks

`useState`: Used to manage the `text` and `loading` state variables.

`useRef`: Used to create a ref object for the message composition textarea element.

`useEffect`: Used to:

- Adjust the height of the textarea element based on its content.
- Scroll the conversation container to the bottom whenever new messages are received.

#### Props

`isOpenS`: (boolean) Prop passed from a parent component to control the visibility of the "Send Message" dialog.

`close`: (function) Function to close the "Send Message" dialog.

`isOpenD`: (boolean) Prop passed from a parent component to control the visibility of the "View Feedback" dialog.

`closeD`: (function) Function to close the "View Feedback" dialog.

`responses`: (array of MessageSimplifyed) Array of objects representing system responses for the conversation.

`setResponses`: (React.Dispatch<React.SetStateAction<MessageSimplifyed[]>>) Function to update the `responses` state.

`requests`: (array of MessageSimplifyed) Array of objects representing user requests for the conversation.

`setRequests`: (React.Dispatch<React.SetStateAction<MessageSimplifyed[]>>) Function to update the `requests` state.

`conversation_id`: (number) Identifier for the conversation.

#### Fetched data (utility & endpoints)

The component fetches data from the server endpoint `/conversations/${conversation_id}/messages` using the POST method whenever the user sends a new message. The request body contains the query text and the task ID retrieved from the context. The response includes the response text, query ID, and conversation metrics.

#### Functions

`handleTextChange`: Handles changes to the message composition textarea, updating the `text` state variable and adjusting the textarea height.

`handleKeyPress`: Handles the Enter key press event in the textarea, triggering the `handleSend` function if pressed.

`handleSend`: Sends a new message to the server, updates the conversation state with the user request and a temporary response, fetches the actual response from the server, and updates the conversation state with the system response and conversation metrics.

`handleClickFeedback`: Creates a function that takes a query ID as an argument. When clicked, it fetches feedback data for the corresponding request using the `/feedback/${query_id}` endpoint and updates the context with the retrieved feedback and conversation metrics.

`showFeedback`: Fetches feedback data for a specific query ID and updates the context with the retrieved feedback and conversation metrics.



### queryComponent.tsx

#### Description

The QueryComponent displays a single user query within a list. It allows users to view the query text and perform actions like deleting the query (triggered by `onDelete`) and liking/unliking the query.

#### Main dependencies

`react`: The core React library for building user interfaces.

`useState`: React Hook for managing component state.

`./queryComponent.css`: The stylesheet containing CSS classes used by the component.

#### State variables

`liked` (boolean): Stores whether the user has liked the query or not.

#### Hooks

`useState`: Used to manage the `liked` state variable.

#### Props

`display_id` (number): Unique identifier for displaying the query within the list.

`stored_id` (number): Unique identifier for the query in the data store.

`queryText` (string): The text content of the user query.

`onDelete` (function): Function passed from a parent component to handle deleting a query. It takes `display_id` and `stored_id` as arguments.

`onOpen` (function): Function passed from a parent component to handle opening a detailed view of a query. It takes `stored_id` as an argument.

`isSelected` (boolean): Prop to indicate if the current query is selected.

`handleSelection` (function): Function to handle user selection of the query.

#### Fetched data (utility & endpoints)

The QueryComponent does not directly fetch data from an external endpoint. However, the parent component fetches data to populate the props (`queryText`, etc.).

#### Functions

`toggleLike`: Handles user interaction with the like button. It updates the `liked` state variable based on the current state and toggles the "liked" class on the like icon.

### likeicon.tsx

#### Description

The LikeIcon component renders a heart icon that can be used to toggle a "like" state. Clicking the icon triggers the `onClick` function passed as a prop.

#### Main dependencies

`react`: The core React library for building user interfaces.

#### State variables

The LikeIcon component does not manage any internal state variables.

#### Hooks

The LikeIcon component does not utilize any React Hooks.

#### Props

`liked` (boolean): Prop indicating whether the icon should be displayed in a "liked" state (filled heart).

`onClick` (function): Function to be triggered when the user clicks the icon.

#### Fetched data (utility & endpoints)

The LikeIcon component does not directly fetch data from an external endpoint.

#### Functions

The component doesn't have any internal functions.

### feedbackPanel.tsx

#### Description

The FeedbackPanel component manages the display and interaction of various sub-components related to feedback and task management. It provides functionalities like searching for tasks, toggling between study mode and feedback mode, resetting feedback and scores, and displaying task details and feedback windows.

#### Main dependencies

`react`: The core React library for building user interfaces.

`useState`: React Hook for managing component state.

`useEffect`: React Hook for performing side effects like data fetching.

`useContext`: React Hook for accessing data from a context provider.

`TaskPanel`: A sub-component for searching tasks.

`FeedbackContext`: A context provider for sharing feedback-related data.

`Metrics`: A model  representing feedback criteria.

`FeedbackWindow`: A sub-component for displaying feedback input.

`TaskDesc`: A sub-component for displaying task description.

`NotStudyMode`: A sub-component for displaying feedback functionality in non-study mode.

`API_URL`: A constant containing the base URL for API requests.

#### State variables

`isFeedbackOpen` (boolean): Controls whether the feedback window is open.

`initialFetch` (boolean): Tracks whether the initial task data has been fetched.

`isRounded` (boolean)

`isRoundedF` (boolean)

`criterionValue` (number): Stores the current value for a specific criterion ( used for feedback).

`progressWidth` (number)

`isStudyMode` (boolean): Indicates whether the component is in study mode or feedback mode.

#### Hooks

`useState`: Used to manage multiple state variables.

`useEffect`: Used for fetching initial task data and resetting feedback/scores on state changes.

#### Props

`isOpenS` (boolean): Prop passed from a parent component to control the overall panel visibility.

`close` (function): Function to close the panel, passed from a parent component.

`isOpenD` (boolean): Prop to control the visibility of the task description sub-component.

`closeD` (function): Function to close the task description sub-component.

#### Fetched data (utility & endpoints)

The component fetches initial task data from the endpoint `${API_URL}/tasks/1` using the `useEffect` hook.

The fetched data is expected to contain properties like `task_id`, `task_name`, `category`, and `description`.

#### Functions

`toggleStudyMode`: Switches between study mode and feedback mode.

`toggleSidebar`: Closes the task search panel (triggered by clicking on the search button).

`resetFeedback`: Resets the feedback text.

`resetScore`: Resets the feedback criteria scores.

`toggleDescription`: Toggles the visibility of the task description sub-component.

`toggleFeedback`: Toggles the visibility of the feedback window.

`returnOverallScore`: Calculates and returns the overall feedback score based on criteria values.

`returnFloatOrNum`: Formats a number to display either as an integer or with one decimal place.

### taskpanel.tsx

#### Description

The TaskPanel component displays a searchable list of tasks categorized by topic. Clicking on a task populates the task name, category, and description in the panel.

#### Main dependencies

`react`: The core React library for building user interfaces.

`useContext`: React Hook for accessing data from a context provider.

`FeedbackContext`: A context provider for sharing feedback-related data.

`Task`: A model representing a task.

API_URL: A constant containing the base URL for API requests.

#### State variables

None - The TaskPanel component does not manage any internal state variables.

#### Hooks

`useContext`: Used to access the `task` object from the FeedbackContext.

#### Props

`isOpenS` (boolean): Prop passed from a parent component to control the overall panel visibility.

`close` (function): Function to close the panel,  passed from a parent component.

#### Fetched data (utility & endpoints)

The component doesn't directly fetch data. Clicking on a task triggers a function to fetch the specific task details using the provided `task.id`.

The data is fetched from the endpoint `${API_URL}/tasks/${taskId}`.

The fetched data is expected to contain properties like `task_id`, `task_name`, `category`, and `description`.

#### Functions

`handleTaskClick` (function): Fetches the details of a clicked task using the task ID and updates the context with the fetched data.



### feedbackWindow.tsx

#### Description

This React component, `FeedbackWindow`, renders a window that displays feedback for a completed task. It retrieves task information and calculates an overall score based on four criteria. Users can view detailed breakdowns of each criterion and reset the feedback and scores.

#### Main dependencies

`react`: The core React library for building user interfaces.

`useState`: React Hook used for managing state variables within functional components.

`useEffect`: React Hook for performing side effects in functional components.

`useContext`: React Hook for using context objects across the component tree.

`Metrics`: A custom model for storing and manipulating criterion scores.

#### State variables

`isOpenF`: Boolean flag indicating whether the feedback window is open.

`isOpenD`: Boolean flag indicating whether the feedback window is open.

`isOpenS`: Boolean flag indicating whether the taskPanel is open.

`isSidebarOpen`: Boolean flag for controlling the sidebar visibility.

`feedback`: String containing the feedback text for the task.

`criteria`: Object of type `Metrics` containing scores for the four criteria.

`task`: Object holding information about the task, including its ID, name, category, and description.

`initialFetch`: Boolean flag used to track whether the initial data fetch has been completed.

`showDescription`: Boolean flag for toggling visibility of the overall score description.

`isRounded`: Boolean flag controlling the rounding style of the progress bar.

`isRoundedF`: Boolean flag controlling the rounding style of individual criterion progress bars (potentially unused).

`criterionValue`: Number representing the current value displayed for a specific criterion (likely for temporary calculations).

`progressWidth`: Number representing the calculated width of the progress bar.

#### Hooks

`useState`: Used to manage all the state variables mentioned above.

`useEffect`:

- Fetches task data from the API endpoint (`/tasks/1`) on initial render and stores it in the `task` state variable.
- Resets feedback and criteria scores whenever the `setFeedback`, `setCriteria`, or `setTask` functions are called.
- Logs the updated criteria object to the console whenever the criteria state changes.

#### Props

`closeF`: Function passed down from a parent component to handle closing the feedback window.

#### Fetched data (utility & endpoints)

The component fetches data about the task from the API endpoint `/tasks/1`. This data includes the task ID, name, category, and description.

#### Functions

`resetFeedback`: Clears the feedback text by setting the `feedback` state variable to an empty string.

`resetScore`: Resets all criterion scores to 0 by creating a new instance of the `Metrics` model with default values.

`toggleDescription`: Toggles the visibility of the overall score description by flipping the `showDescription` state variable.

`animateProgressBar`: Asynchronously updates the progress bar animation based on the calculated overall score. It uses document methods to manipulate the progress bar's styles.

`returnOverallScore`: Calculates the overall score by averaging the four individual criterion scores and formatting it with one decimal place if necessary.

`returnFloatOrNum`: Takes a number as input and returns a string representation with one decimal place if the number is not an integer.



### taskdescription.tsx

#### Description

The `TaskDesc` component renders description panel for a selected task. It displays information like task name, category, and description. It also provides a close button to hide the panel.

#### Main dependencies

`react`: The core React library for building user interfaces.

`useContext`: React Hook for using context objects across the component tree.

`Task`: A custom model class defined in the `./models/task` directory, representing a task object with properties like ID, name, category, and description.

`API_URL`: A constant imported from `./config` containing the base URL for the API.

#### State variables

`task`: This state variable, accessed via `useContext(FeedbackContext)`, holds the currently selected task object.

`setTask`: This function, also accessed via `useContext(FeedbackContext)`, is used to update the selected task object in the context.

#### Hooks

`useContext`: Used to access the `FeedbackContext` and retrieve the `task` and `setTask` state variables.

#### Props

`isOpenD`: Boolean flag indicating whether the delivery feedback window is open.

`isOpenS`: Boolean flag indicating whether the structure feedback window is open.

`closeD`: Function to handle closing the task description panel.

#### Fetched data (utility & endpoints)

When a user clicks on a task, the component fetches detailed task information from the API endpoint `${API_URL}/tasks/${taskId}`. This endpoint returns a JSON object containing properties like `task_id`, `task_name`, `category`, and `description`. The component then uses this data to update the `task` state variable in the context with a new `Task` object.

#### Functions

`handleTaskClick`: This function takes a `taskId` as input and performs the following actions:

- Fetches data from the API endpoint `${API_URL}/tasks/${taskId}`.
- Parses the JSON response and logs it to the console.
- Creates a new `Task` object using the fetched data.
- Updates the `task` state variable in the context using the `setTask` function.
- Catches any errors during the fetch process and logs them to the console.

### notstudymode.tsx

#### Description

The React component NotStudyMode renders a feedback window where it displays real-time feedback on a user's performance on a task.

#### Main dependencies

`useState` and `useEffect` hooks from React for managing state and side effects

`useContext` hook from React for accessing context data

`FeedbackContext` context object for accessing feedback and criteria data

`Metrics` model from the `./models/metrics` file (containing a structure for storing criteria scores)

`API_URL` constant containing the base URL for API requests

#### State variables

`isSidebarOpen`: Boolean state variable to control the visibility of the sidebar

`feedback`: String state variable to store the user's feedback

`criteria`: Object state variable to store the user's performance criteria scores (retrieved from `FeedbackContext`)

`task`: Object state variable to store the task details (retrieved from `FeedbackContext`)

`initialFetch`: Boolean state variable to track whether the initial data fetch has been completed

#### Hooks

`useState` hook is used to manage all the state variables mentioned above.

`useEffect` hook is used for two purposes:

- To fetch the task data from the API on component mount (`!initialFetch`) and update the `task` state variable.
- To reset the feedback and criteria scores whenever the `setFeedback`, `setCriteria`, or `setTask` functions are called.

#### Props

`isOpenF`: Boolean prop to control the visibility of the feedback window

`isOpenD`: Boolean prop to control the visibility of the description window

`isOpenS`: Boolean prop to control the visibility of the taskPanel

`closeF`: Function prop to handle closing the feedback window

#### Fetched data (utility & endpoints)

The component fetches the task details (task ID, name, category, and description) from the `/tasks/1` endpoint of the API specified by `API_URL`.

#### Functions

`resetFeedback`: Resets the feedback state variable to an empty string.

`resetScore`: Resets the criteria state variable to a new `Metrics` object with all scores initialized to 0.

`toggleDescription`: Toggles the visibility of a detailed description section.

`returnOverallScore`: Calculates and returns the overall score for all criteria (average of the individual scores).

`returnFloatOrNum`: Formats a number to either a fixed-point decimal (with one decimal place) or an integer, depending on whether it has a decimal part.





#### 



