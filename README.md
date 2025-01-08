# Rentistan

Rentistan is a mobile application designed to connect tenants with property managers, providing a seamless rental experience. Built using React Native with Expo, Rentistan allows tenants to browse property listings, contact property managers, and manage bookings.

## Features

- **Tenant & Property Manager Profiles**: Tenants can create their profiles, and property managers can list their properties.
- **Contact Property Managers**: Tenants can directly call, email, or message property managers for further inquiries.
- **Notifications**: Rentistan sends notifications to users about various activities and updates.
- **Booking System**: Tenants can engage in bookings with property managers based on mutual understanding.
- **Responsive Design**: Built with a user-friendly interface that adjusts to different screen sizes.

## Screens

- **Home Screen**: Displays available listings for tenants.
- **Profile Screen**: Allows tenants and property managers to view and edit their profiles.
- **Contact Screen**: Lets tenants reach out to property managers via call, email, or message.
- **Booking Screen**: Where tenants and property managers manage bookings.

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase for authentication and Firestore for storing user data and profiles.
- **State Management**: Context API for handling user states and profile types.
- **Notifications**: Integrated push notifications using Firebase Cloud Messaging.

## Installation

To run the app locally using Expo, follow these steps:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/yourusername/rentistan.git
    ```

2. **Navigate to the Project Directory**:

    ```bash
    cd rentistan
    ```

3. **Install Dependencies**:

    ```bash
    npm install
    ```

4. **Start the Development Server**:

    ```bash
    npx expo start
    ```

    This command will start the development server and open a new tab in your default web browser. You can then scan the QR code with the Expo Go app on your mobile device to view the app, or press `a` to run it on an Android emulator, or `i` to run it on an iOS simulator.

    For more information on using Expo CLI, refer to the [Expo CLI documentation](https://docs.expo.dev/more/expo-cli/).

## Contributing

Feel free to fork the repository and submit pull requests for improvements. Here's how you can contribute:

1. Fork the project.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/) for providing the tools to build the app.
- Firebase for providing easy-to-integrate cloud services.
