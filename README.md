# 🏫 Classroom Tracker (CM SHRI SCHOOL , ANDREWS GANJ)

> **An Enterprise-Grade, Full-Stack Educational Management System & Classroom Logistics Platform**  
> Streamline campus administration, automate student-teacher workflows, track attendance analytics in real time, and simplify resource sharing through an intuitive, accessible web interface.

---

[![Deployment Status](https://img.shields.io/badge/Deployment-Vercel-success?style=for-the-badge&logo=vercel)](https://classroom-tracker-cms.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/thakurakshat1008-coder/Classroom-Tracker?style=for-the-badge)](https://github.com/thakurakshat1008-coder/Classroom-Tracker/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/thakurakshat1008-coder/Classroom-Tracker?style=for-the-badge)](https://github.com/thakurakshat1008-coder/Classroom-Tracker/network/members)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

---

## 📌 Quick Links

- 🌐 **Live Web Application:** [https://classroom-tracker-cms.vercel.app/](https://classroom-tracker-cms.vercel.app/)
- 🐙 **GitHub Repository:** [https://github.com/thakurakshat1008-coder/Classroom-Tracker](https://github.com/thakurakshat1008-coder/Classroom-Tracker)
- 🐛 **Issue Tracker:** [Report a Bug / Request a Feature](https://github.com/thakurakshat1008-coder/Classroom-Tracker/issues)

---

## 📖 Table of Contents

1. [Executive Summary & Project Vision](#-executive-summary--project-vision)
2. [Key System Features](#-key-system-features)
   - [Administrator Portal](#1-administrator-portal)
   - [Faculty & Teacher Hub](#2-faculty--teacher-hub)
   - [Student Learning Dashboard](#3-student-learning-dashboard)
   - [Global & Guest Features](#4-global--guest-features)
3. [Visual Gallery & Screenshot Walkthrough](#-visual-gallery--screenshot-walkthrough)
4. [System Architecture & Technology Stack](#-system-architecture--technology-stack)
5. [Database & Data Schema Design](#-database--data-schema-design)
6. [API & Routing Documentation](#-api--routing-documentation)
7. [Comprehensive Directory Structure](#-comprehensive-directory-structure)
8. [Step-by-Step Installation & Local Setup](#-step-by-step-installation--local-setup)
9. [Deployment Protocols](#-deployment-protocols)
10. [Configuration & Environment Variables](#-configuration--environment-variables)
11. [Role-Based Access Control (RBAC) Matrix](#-role-based-access-control-rbac-matrix)
12. [Troubleshooting & Common Edge Cases](#-troubleshooting--common-edge-cases)
13. [Product Roadmap & Future Scope](#-product-roadmap--future-scope)
14. [Contributing Guidelines](#-contributing-guidelines)
15. [License & Acknowledgments](#-license--acknowledgments)

---

## 📘 Executive Summary & Project Vision

In modern academic environments, managing classroom scheduling, student attendance, course syllabus progression, and communication channels often involves fragmented third-party software. **Classroom Tracker (CMS)** is engineered to solve these operational bottlenecks by providing a unified, centralized Content Management System designed tailored for schools, colleges, and educational institutions.

Built with performance, responsiveness, and accessibility as core priorities, Classroom Tracker eliminates administrative redundancy. It empowers institutional leadership with real-time operational telemetry, allows educators to focus on teaching rather than manual bookkeeping, and provides students with transparent visibility into their academic standing.

### 🎯 Primary Objectives
* **Centralization:** Consolidate attendance tracking, course management, notice announcements, and scheduling into a single platform.
* **Accessibility:** Deliver an interface optimized across desktop workstations, tablets, and smartphones.
* **Data-Driven Insights:** Provide real-time charts and reports to highlight attendance deficits, curriculum lag, and scheduling conflicts before they impact academic performance.
* **Low Latency & High Speed:** Minimal dependencies ensure lightweight client loading, fast render speeds, and seamless navigation.

---

## ✨ Key System Features

### 1. Administrator Portal
The administrative engine serves as the control center for institutional management.

* **Institutional Telemetry Dashboard:** Overview of total active students, faculty count, ongoing courses, daily attendance percentages, and room utilization rates.
* **User Lifecycle Management:** Provision, edit, deactivate, or purge user accounts across Admin, Teacher, and Student roles.
* **Classroom & Facility Allocation:** Map subjects to physical or virtual rooms, preventing overlapping time slots and room booking conflicts.
* **System-Wide Broadcast System:** Publish urgent institutional notifications with custom expiration dates and targeted audience tags.
* **Audit Logs & Analytics Export:** Export comprehensive CSV and PDF reports containing attendance logs, grade distributions, and faculty activity records.

### 2. Faculty & Teacher Hub
Designed to minimize administrative burden and streamline class preparation.

* **Dynamic Attendance Matrix:** Record period-by-period or daily attendance with a few clicks, complete with options for Present, Absent, Late, and Excused statuses.
* **Course & Syllabus Progression Tracker:** Break courses down into modules and units, marking syllabus milestones as completed in real time.
* **Assignment & Task Manager:** Issue assignments, define submission windows, set maximum scoring rubrics, and provide individual student feedback.
* **Direct Announcement Engine:** Send instant notifications specifically to students enrolled in a particular course section.
* **Student Academic Overview:** Search individual student profiles to examine historical attendance trends and performance across past assignments.

### 3. Student Learning Dashboard
A centralized portal designed to keep students informed, organized, and accountable.

* **Personalized Daily Timetable:** Real-time visual schedule displaying upcoming lectures, assigned classrooms, and faculty details.
* **Attendance Threshold Meter:** Visual status bar alerting students if their attendance falls below required institutional benchmarks (e.g., 75%).
* **Assignment Hub & Document Access:** View upcoming deadlines, download attached lecture materials, and verify submission status.
* **Notice Feed & Notice Archive:** Filter system announcements by date, priority, or relevant department.

### 4. Global & Guest Features
* **Theme Customization:** Toggle between dark mode and light mode interfaces for eye comfort.
* **Responsive Layout:** Adaptive layouts for mobile phones, tablets, laptops, and ultra-wide desktop monitors.
* **Instant In-Memory Search:** Client-side filtering for immediate table search results without page reloads.

---

## 📸 Visual Gallery & Screenshot Walkthrough

### Main Executive Dashboard
*The central hub providing real-time telemetry on system statistics, attendance averages, and urgent administrative alerts.*

```text
+-----------------------------------------------------------------------------------+
|  🏫 Classroom Tracker CMS   [ Search... ]           (🔔 Notifications) (👤 Profile) |
+-----------------------------------------------------------------------------------+
|  [📊 Dashboard]   |  📈 TOTAL STUDENTS : 1,240     👨‍🏫 TOTAL FACULTY : 85          |
|  [👨‍🎓 Students]    |  📚 ACTIVE COURSES : 42        🏫 ROOM UTILIZATION : 88%       |
|  [📚 Courses]     +---------------------------------------------------------------+
|  [🗓️ Schedule]    |  📊 Daily Attendance Trend (Weekly)                           |
|  [📢 Notices]     |  [ Mon: 94% | Tue: 91% | Wed: 96% | Thu: 89% | Fri: 92% ]       |
|  [⚙️ Settings]    +---------------------------------------------------------------+
|                   |  📢 Recent System Announcements                               |
|                   |  • Mid-Term Examination Schedule Published (Priority: High)  |
|                   |  • Science Lab Maintenance on Friday (Priority: Medium)       |
+-----------------------------------------------------------------------------------+
