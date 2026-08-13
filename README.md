## Fredu Spark

### Learn. Explore. Create.

Fredu Spark is an educational learning platform designed to help students
learn beyond traditional textbooks through practical lessons and
classroom challenges.


### About the Project

Fredu Spark was created from the idea that learning should not stop at
reading and memorising information.

As a student educator and a participant in the Tech4Girls Backend
Development programme, I became interested in how technology could be
used to make education more practical, engaging and interactive. I had the opportunity to see young
students participate in STEM and robotics activities. While the
experience was exciting, it also made me think about how technology and
practical activities could be integrated more intentionally into
everyday education.

This led to the idea behind Fredu Spark:
> **Learning should go beyond books.**
Fredu Spark aims to bridge the gap between technology and education by
giving teachers a way to create practical learning experiences and
giving students opportunities to apply what they learn.

### Purpose of Fredu Spark

The main purpose of Fredu Spark is to encourage **learning by doing**
Instead of students only reading about a topic, the platform allows lessons to be connected to practical classroom challenges.For example, instead of simply learning about water filtration,
students could complete a challenge where they build a simple water filter using everyday materials.

This helps students:
- Apply theoretical knowledge
- Develop problem-solving skills
- Think critically
- Explore concepts practically
- Connect classroom learning to real-life situations
- Learn through experimentation and reflection

### Who Can Use Fredu Spark?
Teachers
Teachers use Fredu Spark to create and manage learning content.
Teachers can:
- Create subjects
- Create lessons
- Create classroom challenges
- Add instructions and materials
- Add learning objectives
- Add real-life applications
- Add reflection questions
- Edit learning content
- Delete learning content

### Students
Students use Fredu Spark to explore and participate in learning
activities.
Students can:
- Browse subjects
- Explore lessons
- View classroom challenges
- Follow challenge instructions
- Apply what they have learned
- Reflect on their learning
- Track completed challenges

### How Fredu Spark Works
Fredu Spark connects teachers, students, the frontend, API and
database.
Teacher
Teacher creates a lesson or classroom challenge.
↓
Fredu Spark API (The FastAPI backend receives and processes the request.)
↓
MySQL Database (The information is stored using SQLAlchemy.)
↓
Student (Students can access the lessons and challenges through the frontend
and use them for practical learning.)

### The application follows this general structure:

Frontend → Fast API → SQL Alchemy → MySQL

### Example Classroom Challenge

### Topic
States of Matter

### Challenge
Find examples of solids, liquids and gases around you.

### Materials
- Notebook
- Pencil
- Everyday objects

### Activity
Identify objects around your environment and classify them according
to their state of matter.

### Reflection
Why does each object belong to its particular state?
The aim is to move students from simply knowing a concept to
actually, using it.

#### Technologies Used

### Backend
- Python
- Fast API
- SQL Alchemy
- MySQL
  

### Frontend
- HTML
- CSS
- JavaScript

### Development Tools
- Visual Studio Code
- MySQL Workbench
- Git
- GitHub


### Project Structure

```text
Fredu_Spark/
│
├── app/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── database.py
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── auth/
│   ├── student/
│   ├── teacher/
│   ├── css/
│   └── js/
│
├── .env
├── .gitignore
├── requirements.txt
└── README.md
