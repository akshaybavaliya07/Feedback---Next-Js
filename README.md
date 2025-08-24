# 👻 Ghost Whisper

> **Ghost Whisper – Where your voice is heard, but your identity remains a mystery.**  
A Next.js 14 app with authentication, verification code system, and anonymous messaging.

---

## 🚀 Live Demo
🔗 [Ghost Whisper Live](https://your-live-deployed-link.vercel.app/)

---

## 🧪 Test Account
Use the following credentials to try the app without signing up:

- **Email:** `test@gmail.com`  
- **Password:** `test@123`  

---

## 🚀 Features

- 🔐 **Authentication (Sign up / Sign in)**
  - Email-based authentication using verification codes.
  - Secure login flow powered by **NextAuth**.
- 📧 **Email Verification**
  - A 6-digit code is sent to the user’s email.
  - Users must verify their email before signing in.
- 💌 **Anonymous Messaging**
  - Anyone can send you a message without revealing their identity.
  - You can view received messages in your dashboard.
- 🎨 **Modern UI**
  - Built with **Next.js App Router**, **TailwindCSS**, and **React Toastify**.

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **NextAuth** (authentication)
- **Nodemailer** (email verification)
- **React Toastify** (notifications)
- **TailwindCSS** (styling)

---

## ⚙️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/ghost-whisper.git
   cd ghost-whisper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```

---

## 🔑 Authentication Flow

1. User enters their **email** on sign up/sign in.  
2. App sends a **6-digit verification code** via email.  
3. User enters the code → Verified → Authenticated.  
4. User can now:
   - Share their unique profile link.
   - Receive anonymous messages.

---

## ✉️ Sending Messages

- Anyone visiting `/u/[username]` can send a message.
- Sender’s identity is **never stored**.
- Only the profile owner can read their received messages.  