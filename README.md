# 🎓 Smart Assignment & Risk Prediction System
📌 Project Overview

This project is a full-stack academic management system designed to streamline assignment handling, student performance tracking, and intelligent risk prediction.

It provides two main interfaces:

## 👨‍💼 Admin Dashboard
## 👨‍🎓 User (Student) Dashboard

Additionally, it integrates a machine learning-based risk prediction model to identify students who may need attention.

🚀 Key Features
👨‍🎓 User Interface (Student Panel)
🔐 Secure Login & Registration (OTP-based authentication)
📚 View Assigned Tasks
📤 Submit Assignments
📊 View Performance & Feedback
⏰ Track Deadlines
⚠️ Risk Score Visibility (based on performance)
👨‍💼 Admin Interface (Dashboard)
👥 Manage Users (Students)
📝 Create & Assign Assignments
📥 View All Submissions
📊 Monitor Student Performance
⚠️ Risk Prediction Dashboard
📧 Automated Email Notifications
🧠 Intelligent Risk Prediction System

The system uses a Machine Learning Model (XGBoost) to predict student risk levels.

🔍 Inputs:
Assignment completion rate
Performance scores
Difficulty level
⚙️ Logic:
Feature processing using NumPy & Pandas
Prediction using trained XGBoost Classifier
Explainability using SHAP values
🎯 Output:
Risk Level (Low / Medium / High)
Explanation of why a student is at risk
🏗️ Tech Stack
Frontend:
React.js
CSS (Modern UI / Dashboard Design)
Backend:
Node.js
Express.js
Database:
MongoDB
Machine Learning:
Python
XGBoost
SHAP
🔄 System Workflow
User logs in
Admin assigns tasks
User submits assignments
System tracks performance
ML model predicts risk
Admin views insights & takes action
🎥 Demo Flow (For Presentation)
🔑 Login as User
📚 View assignments
📤 Submit assignment
📊 Show performance

➡️ Switch to Admin

👨‍💼 Login as Admin
📝 Create assignment
📥 View submissions
📊 Show risk dashboard
🔮 Future Scope: Proctored Test System

The system can be extended with an AI-based Proctored Test Module.

🚧 Planned Features:
🎥 Webcam Monitoring
👀 Eye Tracking
📵 Tab Switching Detection
🧠 Suspicious Activity Detection (AI)
📊 Integrity Score Generation
💡 Goal:

Ensure fair and secure online examinations.

📌 Conclusion

This project combines:

📊 Data-driven insights
🤖 Machine learning
🌐 Full-stack development

to create a smart academic monitoring system that improves student outcomes and administrative efficiency.
