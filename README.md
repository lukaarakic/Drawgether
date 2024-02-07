# Drawgether

![Remix](https://img.shields.io/badge/remix-%23000.svg?style=for-the-badge&logo=remix&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)
[![Supabase](https://img.shields.io/badge/supabase-black?logo=supabase&style=for-the-badge)](https://supabase.io/)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

Drawgether is a social media web application that focuses on sharing artwork created through a multiplayer drawing game. In this game, players have 5 minutes to draw a theme provided by ChatGPT. The platform allows 2-5 players to engage in collaborative drawing sessions.

<a href="https://drawgether.netrunners.work/" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/Live%20Demo-Click%20Here-success?style=for-the-badge" alt="Live Demo" />
</a>

> :warning: **Important:** Hosting may experience temporary issues. If you encounter any disruptions, simply refresh the page, and it should be resolved.

![Drawgether Screenshot](https://i.imgur.com/IUq2yAN.png)

## Features

- **Multiplayer Drawing Game:** Engage in a 5-minute drawing game with 2-5 players, inspired by themes suggested by ChatGPT.

- **Artwork Sharing:** Share your drawings on the platform's social feed, creating a vibrant community of artists.

- **SEO Optimization:** Utilizes SEO best practices to enhance the discoverability of content on search engines.

- **Error Boundary:** Implemented error boundaries on every page to gracefully handle unexpected errors.

- **Form Validation Sync:** Client and server-side form validations are synchronized to ensure data integrity.

- **Honeypot for Anti-Bot Spam:** Strengthens form security.

- **CSRF Protection:** Generates CSRF codes in cookies for every session to secure vital functions.

- **Rate Limit (DoS Protection):** Certain functions have limited attempts per hour.

- **Database Seeding:** Includes a feature for automatically populating the database with random data.

- **Authentication & Authorization (A&A):** Implements full-stack authentication and authorization, including password hashing with bcrypt (Blowfish cipher algorithm).

- **Session Management:** Generates a session cookie upon login or register, and implements a "remember me" feature.

- **Role-Based Permissions:** Utilizes role-based permissions (like discord's).

- **Verification:** Implements user verification using Time-based One Time Passwords (TOTP) for email and password change requests.

## Installation

To run the Drawgether locally, you need to have [Node.js](https://nodejs.org) installed on your machine. Follow these steps:

1. **Clone the repository:**

   ```shell
   git clone https://github.com/lukaarakic/Drawgether
   ```

2. **Navigate to the project directory:**

   ```shell
   cd Drawgether
   ```

3. **Install the dependencies:**

   ```shell
   npm install
   ```

4. **Populate .env template**

   ```ts
    # Secrets
    HONEYPOT_SECRET=""
    SESSION_SECRET=""

    # Database
    DATABASE_URL=""
    DIRECT_URL=""

    # Email
    RESEND_API_KEY=""

    # OpenAi
    OPENAI_API_KEY=""
   ```

5. **Start the development server:**

   ```shell
   npm run dev
   ```

   This will start the development server and open the Drawgether in your default browser.

   > Note: Ensure you have Node.js installed on your machine before running the above commands.

6. **Access the Drawgether:**

   Once the development server is running, you can access the Drawgether by navigating to http://localhost:3000: in your web browser.

   > Note: You may need to wait a few moments for the development server to compile and launch the application.

7. **Start exploring the Drawgether:**

   You can now start exploring Drawgether. Enjoy! 😁

## Usage

1. **Accessing Drawgether:**
   Open the Drawgether using the URL [Drawgether](https://drawgether.netrunners.work/), or run it locally.

2. **Authenticate:**
   Register or log in to access to the app and participate in drawing games.

3. **Navigating and Interacting:**
   Utilize the platform's intuitive interface to navigate, explore, and engage with various features.

4. **Engaging in Drawing Games:**
   - Go to play page and join or create a drawing game session.
   - Collaborate with 2-5 players to create artwork based on ChatGPT's suggested themes.
   - After 5 minutes session ends and art that you draw will be published

## Contact

If you have any questions, suggestions, or feature requests, please feel free to reach out to me:

- Mail: [Luka Rakić](mailto:rakic@netrunners.work)

# Credits

- **Designer:** Nikola
  - GitHub: [nikolchaa](https://github.com/nikolchaa)
  - LinkedIn: [Nikola Ranđelović](https://www.linkedin.com/in/nikolchaa/)
