# Ticket-management-system

**Ticket Management System:** A web-based app to manage customer support tickets. Users can sign up, create and assign tickets, track progress, and chat with customers through a chatbot widget.  
Features include ticket dashboards, team management, real-time chat, analytics, and support for multiple admins with their own teams.

Built with: **React.js**, **Node.js**, **Express.js**, and **MongoDB**
# 🎮 Demo Credentials  
Use the following credentials to explore the platform:  

- **Email**: `jack@gmail.com`  
- **Password**: `Jack@000`  

Feel free to log in and test the features! 🚀  

# Landing Page  
- A **public-facing** landing page.  
- Fully **responsive** across all devices.  
- Users can **sign in** or **sign up** directly from this page.
  ![image](https://github.com/user-attachments/assets/6759e9fd-432d-411d-9365-51ddf021983c)
# Sign up Page

Users can register an account by providing the following details:
- **First Name**
- **Last Name**
- **Email** (must be unique)
- **Username**
- **Password** (securely hashed using bcrypt) with a password strength bar
- **Confirm Password** (must match the password)

Duplicate email registrations are not allowed.
# Invite User

Team members must sign up using the email address **invited by the admin**.  
To join, users will receive an invitation email with a link to activate their account. They can only log in once they’ve registered with the specific email that the admin invited.

- **Email Activation**: Users must activate their account by signing up with the admin-invited email.
- **Login Restriction**: Only users who sign up with the correct, invited email can log in.
  ![image](https://github.com/user-attachments/assets/61ddfbae-b8ee-4f86-b631-08e9bfe4e702)

  # Sign In Page

Users can log in by providing their registered **Email** and **Password**.  
Authentication is done using **JWT** (JSON Web Tokens) for secure login.

- **Email**: Must be an existing, registered email.
- **Password**: Verified using bcrypt (hashed passwords).
- **JWT Authentication**: Ensures secure user sessions.

**Note**:  
After the admin invites you, you must first activate your account by signing up with the **same email**. The **default password** for new users will be provided by the admin. After signing up, you can log in using your email and the default password.
![image](https://github.com/user-attachments/assets/3778520b-8073-410c-9950-f6538370b851)
# Home Page

The home page includes a **navigation bar** with the following options:

- **Dashboard**
- **Chat Area**
- **Analytics**
- **Chatbot Editing**
- **Team Configuration**
- **Settings**
- **Logout**


# Dashboard with Ticket Sections

The dashboard includes three main sections:

- **All Tickets**: View all submitted tickets.
- **Resolved Tickets**: View tickets that have been resolved.
- **Unresolved Tickets**: View tickets that remain unresolved.

# Ticket Search Functionality

Users can search through tickets by various criteria to quickly find and manage specific tickets.
![image](https://github.com/user-attachments/assets/ff052337-e17e-4a66-bb64-018fabb83510)

# Default Ticket Assignment to Admin

All newly created tickets are automatically assigned to the admin by default for initial management.
# Chat Area

In this page, **admins** and **team members** can chat with users to resolve their issues. Key features include:

- **Close Ticket**: Admins and team members can close tickets after the issue is resolved.
- **Open Ticket**: Admins can reopen closed tickets if needed.
- **Assign Ticket**: Tickets can be assigned to different team members for resolution.
- **Team Toggle**: Switch between different chats using the team toggle feature.

Additional features:
- **Missed Chat Alert**: Alerts are triggered if a chat is not responded to within the **confirmed missed time**.
- **Chat Closed Alert**: Notifications when a chat is closed.

Once a **ticket is assigned to a different team member**, the previous user can't access the chat anymore.

- **User Details**: The user’s details are shown on the right side of the page.
- **Chat List**: Different chats are displayed on the left side, where users can toggle between different conversations.
![image](https://github.com/user-attachments/assets/485062a7-d61a-4775-8019-a4bf1bfd680b)

![image](https://github.com/user-attachments/assets/a2cc5dcd-cdae-4a8f-8db4-4acb838cd3d9)

# Analytics Page for Ticket Tracking

The **Analytics Page** provides detailed analytics and reports on ticket resolution times, team performance, and other relevant metrics. The analytics are displayed in the following ways:

1. **Graph of Missed Chats**: Displays the total missed chats over the last 10 weeks.
2. **Average Reply Time**: Shows the average response time in seconds.
3. **Resolved Tickets Percentage**: Displays the percentage of tickets that have been resolved.
4. **Total Number of Chats**: Shows the total number of chats handled.

These analytics help track team performance and identify areas for improvement.
![image](https://github.com/user-attachments/assets/aff17840-c1aa-4245-b0ef-efdbe4c9f93e)
# Team Configuration Page

The **Team Configuration Page** allows admins to manage their team members. Admins can add new team members by providing the following details:

- **Name**
- **Email** (used for sign-up and sign-in process)
- **Role** (admin, team member, etc.)

These credentials are used by team members to sign up and log in. Admins can also:

- **Delete** a team member.
- **Update** team member details as needed.

# Team Page to Manage Members

A dedicated page where admins can add, remove, or manage team members, ensuring the right people are involved in ticket management. This page gives admins full control over their team.
![image](https://github.com/user-attachments/assets/20e11fb7-305b-49ae-8f96-988debf132cb)
# Chatbot Configuration Page

The **Chatbot Widget Customization Page** allows **admins** and **team members** to configure the appearance and behavior of the chatbot widget for normal users. Key features include:

- **Customizable Appearance**: Admins can change the chatbot's look, including colors, size, and position on the website.
- **Behavior Settings**: Admins can modify how the chatbot behaves, such as greeting messages, response delay, and interaction style.
- **Widget Personalization**: Enables admins to personalize the chatbot to better fit the platform’s branding and user experience.
![image](https://github.com/user-attachments/assets/3f9ec3fe-661b-45f4-bb88-f6e1892d0991)


# Missed Chat Timer

The **Missed Chat Timer** is a feature that automatically tags a chat as **"missed"** if the support team fails to respond within a set timeframe after the first user query.

- **Automatic Tagging**: If the support team does not respond within the defined timeframe, the chat will be marked as missed.
- **Timeframe Configuration**: The admin can set the duration after which a chat is considered missed, ensuring timely responses.
![image](https://github.com/user-attachments/assets/b00d9a28-a4b8-4094-9e7c-a0f104b7ec71)

# Edit Profile Feature

The **Edit Profile** feature allows both **admins** and **team members** to update their profile information. Users can modify the following details:

- **Name**
- **Email**
- **Role**
- **Other relevant details**

This feature ensures that user profiles are always up-to-date and accurate.
# Edit Profile Feature

The **Edit Profile** feature allows both **admins** and **team members** to update their profile information. Users can modify the following details:

- **Name**
- **Email**
- **Role**
- **Other relevant details**

**Note**: 
- All fields are prefilled with the user's existing data for convenience, so they can easily update only the information that needs changing.
- Once the profile is updated, the user will be logged out immediately for security purposes.

This feature ensures that user profiles are always up-to-date and accurate.
![image](https://github.com/user-attachments/assets/ac3ffc3b-fb08-4f8a-b5a2-ae70fd2f070c)
**Profile Option**:  
- When the user clicks on their profile, a **pop-up** will appear with a **Logout** button.
- Clicking **Logout** will immediately log the user out of the system.
- ![image](https://github.com/user-attachments/assets/8f39c200-71ac-47c8-8f06-a36db3b2bfcc)

- # Chat Option on Landing Page

On the **Landing Page**, users can click on the **Chat Option** to start a conversation. When they click, they will be asked to fill in the following details:

- **Name**
- **Email**
- **Phone Number**

Once the user submits their details, they will be able to **communicate with a team member** to resolve their queries or issues through the chat interface.
![image](https://github.com/user-attachments/assets/7db6b852-6412-4be3-a205-afa8d328d7f9)

# Tech Stack

## Frontend
- **React**: For building the user interface.
- **Vanilla CSS**: For styling the application.

## Backend
- **Node.js with Express**: For the backend server and API handling.
- **MongoDB**: For database storage.

## Hosting
- **Frontend**: Deployed using **Vercel** or **Netlify**.
- **Backend**: Deployed using **Render** or **Heroku**.


