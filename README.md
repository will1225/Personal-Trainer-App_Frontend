# Getting Started
1. Run **npm install** to install dependencies.
2. Pull the latest code: **git pull origin main** (Always pull before development and push)
3. Start Expo with: **npx expo --dev-client** or **npx expo --dev-client -c** to clear cache
4. Open the emulator (e.g., press a for Android).
   
   ![image](https://github.com/user-attachments/assets/b71a6f35-29a6-424a-ac95-8a398b8533b9)  
6. Install the development build using the emulator's built-in Chrome browser with address **https://expo.dev/accounts/kwcarlos/projects/pta/builds/26af2051-8391-41b0-b452-976516ebf573**
   
   ![image](https://github.com/user-attachments/assets/08412310-0936-406c-bc23-dfb3af0485ad)

7. If the app doesn't load automatically, manually open the pta app in the emulator menu.
   
   ![image](https://github.com/user-attachments/assets/9ac571bc-02c5-450a-8f74-9e18c5cc85bb)
8. In any case if the emulator freezes, try to press the Overview button, or stop the server (Ctrl + C) and rerun **npx expo --dev-client -c**
   
   ![image](https://github.com/user-attachments/assets/e73bedb6-039c-4ad3-b945-e3782843df91)

# Formatting and Linting

## **Recommended IDE Extensions**

Please install the following extensions in your IDE:
- **ESLint**
- **Prettier**

## **Formatting and Linting Commands**

- **Format Code**:
  ```sh
  npm run prettier
  ```

- **Run Linter**:
  ```sh
  npm run lint
  ```

- **Run Linter with Autofix**
  ```sh
  npm run lint:fix
  ```

## **Pre-commit Hooks Setup**

**Husky** and **lint-staged** are used to automatically format and fix linting issues during commits.

- Run `npm install` from the root of the project.
- Install Husky hooks:
    ```sh
    npx husky init
    ```
    
# Dynamic Debugging between the Frontend and Backend
This debugging method requires specific setups in both the frontend and backend. It is not mandatory for this project, you are free to use other debugging methods like Thunder Client or simply console logs.

## Frontend
1. In the `Run and Debug window` (Ctrl + Shift + D), add a new config
   ![image](https://github.com/user-attachments/assets/0639bd3d-c109-4837-a265-8f4b1b521cf0)

2. Select React Native > Attach to application > Application in direct mode(Hermes) > Hermes engine > localhost > confirm your default port. This should create a new `launch.json` file under .vscode folder.
   
3. Copy the following config to the newly created `launch.json` file (**Be sure to add it to .gitignore**):
   
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug Android - Experimental",
         "request": "launch",
         "type": "reactnative",
         "cwd": "${workspaceFolder}",
         "platform": "android"
       },
       {
         "name": "Attach to Hermes application",
         "request": "attach",
         "type": "reactnativedirect",
         "cwd": "${workspaceFolder}"
       },
       {
         "name": "Debug Android",
         "type": "reactnative",
         "request": "launch",
         "platform": "android",
         "target": "emulator",
         "remoteRoot": "${workspaceFolder}",
         "localRoot": "${workspaceFolder}",
         "sourceMaps": true
       },
       {
         "name": "Debug iOS",
         "type": "reactnative",
         "request": "launch",
         "platform": "ios",
         "target": "simulator",
         "remoteRoot": "${workspaceFolder}",
         "localRoot": "${workspaceFolder}",
         "sourceMaps": true
       }
     ]
   }

4. Select `Attached to Hermes application` as the debugger and run F5
   
   ![image](https://github.com/user-attachments/assets/8dc97afb-6521-4da8-841f-dd4b9dc678c7)

5. When the debugger successfully attached, it should show the status(blue bar) at the bottom:

   ![image](https://github.com/user-attachments/assets/1870de08-74d7-4754-8aa0-3c37df4bee83)


## Backend
1. In the Run and Debug Window (Ctrl + Shift + D), choose **JavaScript Debug Terminal**
   ![image](https://github.com/user-attachments/assets/06bb035a-65d7-4d13-b3c8-595993aa841f)

2. Open a JavaScript Debug Terminal
   
   ![image](https://github.com/user-attachments/assets/830070be-0e5a-489c-8aeb-66be3fbbf7f0)

3. Run **node app.js** in the src folder to start the server. The debugger should automatically attach.
   
   ![image](https://github.com/user-attachments/assets/b85055eb-cbfc-4bdc-b449-73da3b280313)


## Usage
With the debuggers successfully set up in the frontend and backend, change only the endpoints you need to test to local with you ip address(**Be sure to change it back to production when pushing**). For example:

```
export const fetchWorkoutEnv = async () => {
    try {
      const response = await fetch(
        // Local testing
        `http://${your ip4 address}:8080/routine/workoutEnv`,

        // Production
        //`https://7u45qve0xl.execute-api.ca-central-1.amazonaws.com/dev/routine/workoutEnv`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
```

**Summary**: 
From now on, when you run `node app.js` in the backend AND run `F5` in the Frontend, you should be able to dynamically hit the breakpoints and see the data flow with the frontend and backend connected.

Backend:
![image](https://github.com/user-attachments/assets/154905ea-1078-48b0-be0d-419d3da7fa63)

Frontend:
![image](https://github.com/user-attachments/assets/64179175-cf53-4cdf-aa52-2d9e924315ee)


