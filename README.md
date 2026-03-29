# Cal.com Clone – Scheduling Platform

A full-stack scheduling and booking platform inspired by **Cal.com**, built as part of an SDE Intern assignment.  
Users can create event types, set availability, and allow others to book meetings through a public page.

---

## 🚀 Live Demo
https://calcom-clone-scheduling-platform.vercel.app

## 📂 GitHub Repository
https://github.com/manavagarwal123/calcom-clone-scheduling-platform

---

## 📌 Features

### 1. Event Types Management
- Create event types (title, description, duration, slug)
- Edit and delete events
- Unique public booking link for each event
- Dashboard listing all events

### 2. Availability Settings
- Set available days (Mon–Sun)
- Configure time slots (e.g., 9 AM – 5 PM)
- Timezone support

### 3. Public Booking Page
- Calendar-based date selection
- Dynamic slot generation
- Booking form (name + email)
- Prevents double booking
- Booking confirmation screen

### 4. Bookings Dashboard
- View upcoming bookings
- View past bookings
- Cancel bookings

---

## ✨ Bonus Features
- Fully responsive UI (mobile + desktop)
- Cal.com-inspired UI/UX
- Timezone auto-detection
- Clean modular architecture

---

## 🧑‍💻 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS

### Backend
- Next.js API Routes (Node.js)

### Database
- PostgreSQL (Neon DB)
- Prisma ORM

---

## 🗄️ Database Design

Key Models:
- EventType
- Schedule
- ScheduleAvailability
- Booking

Relationships:
- One EventType → Many Bookings
- One Schedule → Many Availabilities
- One Schedule → Many EventTypes

---

## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/manavagarwal123/calcom-clone-scheduling-platform.git  
cd calcom-clone-scheduling-platform  

### 2. Install dependencies
npm install  

### 3. Setup environment variables

Create a `.env` file and add:

DATABASE_URL="your_database_url"

### 4. Run database setup
npx prisma generate  
npx prisma migrate deploy  

### 5. Start development server
npm run dev  

Open:  
http://localhost:3000  

---

## 🌐 Deployment

Deployed using **Vercel**

Steps:
1. Push code to GitHub  
2. Import repo in Vercel  
3. Add environment variable: DATABASE_URL  
4. Deploy  

---

## 🧪 Sample Data

The database includes:
- Sample event types (30min, 60min)
- Predefined availability
- Example bookings

---

## 📊 Assumptions

- No authentication (single default user)
- Time slots generated dynamically from availability
- No external calendar integrations
- Booking stored in database only

---

## 🎯 UI/UX Design

- Inspired by Cal.com
- Dark theme dashboard
- Clean scheduling flow
- Fully responsive layout

---

## 📁 Folder Structure

app/  
 ├── api/              # Backend routes  
 ├── dashboard/        # Admin UI  
 ├── book/[slug]/      # Public booking page  

lib/  
 ├── prisma.js         # DB connection  
 ├── slots.js          # Slot generation logic  

---

## 🧠 Key Learnings

- Fullstack system design  
- Prisma + PostgreSQL integration  
- Slot generation logic  
- Preventing double bookings  
- Deployment with Vercel  

---

## ⚠️ Important Notes

- This project is built from scratch  
- No plagiarism from existing repositories  
- AI tools were used, but full understanding of code is maintained  

---

## 👨‍💻 Author

Manav Agarwal  

---

## 📄 License

MIT License