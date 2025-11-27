# Project exam 2 - Holidaze

**Diana Bergelin**

![Holidaze Banner](https://github.com/user-attachments/assets/dbe60277-928f-495e-bc18-c2116e1e5f36)


## 🎯 Assignment Goal

A modern, responsive front-end for Holidaze, where customers can discover and book stays while venue managers create and manage venues and bookings. API-integration with Noroffs Holidaze API.

Overview

- Visitors can browse venues, search, and open a venue page.
  
- Customers can log in, book dates, view upcoming bookings, and update their profile/avatar.

- Venue Managers can log in, create/edit/delete venues, and see bookings for the venues they manage.

- Mobile-first UI with accessible forms, responsive tables → cards on small screens, skeleton loading, and toast notifications.

[🔗 Live Demo](https://holidazetravels.netlify.app/)

---

## 🛍️ Project Brief

**All Users**

- View a list of venues

- Search for venues

- View a single venue by ID

- Register as Customer or Venue Manager (stud.noroff.no email)

- See a calendar with available/booked dates

**Customers**

- Log in / Log out

- Create a booking

- View upcoming bookings

- Update avatar/profile picture

**Venue Managers**

- Log in / Log out

- Create, edit, delete a venue

- View upcoming bookings for owned venues

- Update avatar/profile picture

---

## Features

- 🔎 Search & Filters: “Where” input, date range (check-in/out), guests.

- 🏨 Venue Pages: Media gallery, details/amenities, price, availability calendar, booking CTA.

- 📅 Bookings: Date validation, nights × price calculation, upcoming bookings view.

- 👤 Profiles: Avatar & banner update; role-aware tabs (Customer vs Manager).

- 🧰 Manager Tools: Create/Edit/Delete venues, see bookings per venue.

- 💖 Saved Venues: Favorite/unfavorite venues; skeletons while loading.

- 🍞 Toasts & Modals: Global toasts (success/error/info); confirm modal for destructive actions.

- 📱 Responsive: Cross browsers

---

## Technologies Used

### 🔧 Tech


### Frontend
![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)

### State & Data
![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge)

### Tooling
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white&style=for-the-badge)
![Prettier](https://img.shields.io/badge/-Prettier-F7B93E?logo=prettier&logoColor=black&style=for-the-badge)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white&style=for-the-badge)

### Deployment
![Netlify](https://img.shields.io/badge/-Netlify-00C7B7?logo=netlify&logoColor=white&style=for-the-badge)

---

## Installation

Make sure you have **Node.js** installed on your machine.

### 1. Clone the repository

```bash
npm install
cp .env.example .env.local   # create and edit env file
npm run dev    
```

```bash
# .env.local
NEXT_PUBLIC_API_BASE=https://api.noroff.dev/api/v1/holidaze
```

---

## Core Flows

- Home / Search: “Where” + date range + guests. On small screens, date fields align side-by-side from ~420px; desktop uses a 5-column layout.

- Venue Detail: Images, description, amenities, location, availability calendar, total price calculation, booking.

- Profile:

Customer tabs: Bookings, Saved

Manager tabs: My Venues, Venue Bookings, Bookings, Saved

Edit Profile modal (avatar, banner, name, bio)

Manager CRUD: Create/Edit/Delete venues with confirm modal + toasts.

Saved Venues: Grid of favorites; shows skeletons while fetching details.

---

## Credits

Design & Code: Diana Bergelin

Images: Unsplash, Noroff API

Icons: React Icons, iconify figma

Inspiration: Pinterest, Ving, Solresor, Tui

Learning Support: Next homepage, ChatGPT, Youtube tutorials, Noroff resources

---

## License

This project was built for educational purposes at Noroff and is not licensed for commercial use.

---

## Contact

📧 diana.bergelin@live.se

🔗 [LinkedIn](https://www.linkedin.com/in/diana-b-4209a72ba/)

[Back to Top](#project-exam-2---holidaze)

