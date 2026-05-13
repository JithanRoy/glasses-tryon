# 🕶️ AI Glasses Virtual Try-On Platform

## 📌 Project Overview

This project is an AI-powered virtual try-on platform that allows customers of physical and online eyewear shops to try different glasses virtually using their phone camera or uploaded photo.

Customers scan a QR code from a shop, open a web application, and instantly see how different glasses look on their face using AI-based face tracking and overlay rendering.

---

## 🎯 Main Goal

To build a **multi-tenant SaaS platform** for shops where:

- Each shop can onboard their product catalog (glasses)
- Customers can scan a QR code in-store or online
- Users can try multiple glasses variants in real time
- Shops can increase conversion rate and sales using AI visualization

---

## 🧠 Core Idea

Instead of generic AR apps, this system is:
- **Shop-based (B2B SaaS model)**
- QR-driven user experience
- Lightweight browser-based AI try-on
- Focused initially only on **glasses (eyewear)** for simplicity and accuracy

---

## 🧱 System Architecture

### Frontend
- Next.js (React-based framework)
- QR code based routing (e.g. `/shop/{shopId}`)
- Camera + image upload support
- Real-time AI glasses overlay rendering

### Backend
- NestJS (REST API server)
- Handles:
  - Shop management
  - Product (glasses) management
  - API authentication (future)
  - QR/shop mapping

### Database
- Supabase (PostgreSQL)
- Stores:
  - Shops
  - Glasses products
  - Product images
  - Metadata

### AI Layer (Client-side)
- MediaPipe Face Mesh
- OpenCV-style landmark detection
- Glasses positioning using facial landmarks (eyes + nose bridge)

---

## 🔄 User Flow

1. Shop generates QR code for their store page
2. Customer scans QR code
3. Opens Next.js web app
4. Uploads image or uses camera
5. AI detects face landmarks
6. Glasses are overlaid dynamically on face
7. User can switch between different glasses styles

---

## 🛠️ Tech Stack

- Frontend: Next.js, React, TailwindCSS
- Backend: NestJS, Node.js
- Database: Supabase (PostgreSQL)
- AI/Computer Vision: MediaPipe Face Mesh
- Storage: Supabase Storage (images)

---

## 🚀 MVP Scope (Phase 1)

- Glasses-only virtual try-on
- QR-based shop routing
- Basic product catalog per shop
- Real-time face detection in browser
- Simple overlay rendering (no 3D models)

---

## 📈 Long-term Vision

- Expand to sunglasses, frames, and fashion accessories
- Multi-brand SaaS platform for all eyewear shops
- Analytics dashboard for shops (conversion tracking)
- AI-based style recommendations

---

## ⚠️ Key Constraints

- Must run in browser (no app install required)
- Must be lightweight for mobile devices
- Must work with low-cost hardware (common phones)
- Must prioritize speed over perfect realism in MVP stage