export const mockNotices = [
  {
    id: "n1",
    title: "Mid-Term Examination Schedule Released",
    category: "Academic",
    postedDate: "2026-06-25",
    isUrgent: true,
    author: "Office of the Controller of Examinations",
    description: "The official schedule for the upcoming Mid-Term Examinations for the Summer 2026 semester has been released. Exams are scheduled to begin on July 6, 2026, and will run through July 15, 2026. All students are advised to check their respective department boards or the student portal for detailed slot timings and seating arrangements. Remember to bring your valid Student ID Card and registration slips to the exam hall.",
    content: "Important Guidelines:\n1. Seating plans will be posted daily outside the examination halls by 8:00 AM.\n2. Any form of academic dishonesty will lead to immediate disqualification and disciplinary action.\n3. Mobile phones, smartwatches, and programmable calculators are strictly prohibited in the exam halls.\n4. Standard scientific calculators (non-programmable) are allowed unless specified otherwise by the course instructor."
  },
  {
    id: "n2",
    title: "Google Campus Placement Drive - Registration Open",
    category: "Placement",
    postedDate: "2026-06-26",
    isUrgent: true,
    author: "Career Development & Placement Cell",
    description: "Google is visiting our campus for a recruitment drive targeting final-year Engineering and Computer Science students for Software Engineering (SWE) and Associate Product Manager (APM) roles. Eligible students must have a CGPA of 8.0 or above with no active backlogs. Registration closes on June 30, 2026, at 11:59 PM.",
    content: "How to Apply:\n1. Log in to the Placement Portal.\n2. Update your profile and upload your latest resume in PDF format.\n3. Search for 'Google SWE Recruitment Summer 2026' and click 'Apply Now'.\n4. Prepare for the preliminary online coding test scheduled for July 3, 2026."
  },
  {
    id: "n3",
    title: "Annual Sports Meet 'AEROS 2026' Registrations",
    category: "Sports",
    postedDate: "2026-06-24",
    isUrgent: false,
    author: "Campus Sports Committee",
    description: "Gear up for AEROS 2026, the annual inter-college sports festival. Registrations are now open for both team and individual sports events, including Football, Basketball, Cricket, Athletics, Table Tennis, and Badminton. Show your sportsmanship and represent your hostel or department!",
    content: "Registration details:\n- Individual events: $5 registration fee.\n- Team events: $20 registration fee per team.\n- Register at the Sports Arena reception desk or online at aerosols2026.campus.edu.\n- Last date to register is July 2, 2026. Selection trials will start from July 4, 2026."
  },
  {
    id: "n4",
    title: "Hostel Wi-Fi Maintenance Notice",
    category: "Administrative",
    postedDate: "2026-06-27",
    isUrgent: false,
    author: "IT Support & Services",
    description: "Please note that the primary Wi-Fi network in Hostels A, B, and C will experience intermittent downtime on Sunday, June 28, 2026, between 2:00 AM and 6:00 AM due to scheduled maintenance and fiber-optic backbone upgrades. We apologize for any inconvenience caused.",
    content: "During this maintenance window, the wired LAN in study rooms will remain operational. For urgent issues, you can connect to the backup 'Campus-Guest' network, though bandwidth will be limited."
  },
  {
    id: "n5",
    title: "Robotics Club Workshop: Intro to ROS 2",
    category: "Clubs",
    postedDate: "2026-06-23",
    isUrgent: false,
    author: "Campus Robotics Club (CRC)",
    description: "The Robotics Club is organizing a hands-on workshop on the Robot Operating System (ROS 2). This workshop is designed for beginners who want to build their first simulated autonomous mobile robot. Prerequisites: Basic Python programming and knowledge of Linux commands.",
    content: "Date: July 1, 2026\nTime: 4:00 PM - 7:00 PM\nVenue: Advanced Robotics Lab, Block-D\nNote: Please bring your own laptop with Ubuntu 22.04 LTS pre-installed. ROS 2 installation scripts and guides will be sent to registered participants."
  },
  {
    id: "n6",
    title: "Library Hours Extended for Exams",
    category: "Academic",
    postedDate: "2026-06-26",
    isUrgent: false,
    author: "Central Library Management",
    description: "In view of the upcoming mid-term examinations, the Central Library will remain open 24/7 starting from June 29, 2026, until July 16, 2026. Additional study rooms have been allocated in the library basement to accommodate more students.",
    content: "Additional Services:\n- Coffee and tea vending machines will be operational in the lobby.\n- Security staff will be present around the clock.\n- Library reference desk will be active until 10:00 PM daily. Please maintain silence and follow library rules."
  },
  {
    id: "n7",
    title: "Scholarship Applications for Fall 2026",
    category: "Administrative",
    postedDate: "2026-06-22",
    isUrgent: false,
    author: "Financial Aid & Scholarship Office",
    description: "Applications are invited for the Merit-cum-Means Scholarship and Dean's Merit List Scholarship for the upcoming Fall 2026 semester. Eligible students must submit their academic transcripts, income certificates, and statement of purpose by July 20, 2026.",
    content: "Criteria:\n- Merit-cum-Means: Family income below $15,000 per annum and CGPA of 7.5 or above.\n- Dean's Merit: CGPA of 9.5 or above in the previous two academic semesters.\n- Applications forms can be downloaded from the university portal under 'Financial Services'."
  },
  {
    id: "n8",
    title: "Campus Green Drive: Tree Plantation",
    category: "Clubs",
    postedDate: "2026-06-21",
    isUrgent: false,
    author: "Eco-Warriors Club",
    description: "Join us in our effort to make our campus greener! The Eco-Warriors Club is organizing a tree plantation drive this Saturday. Free refreshments, t-shirts, and participation certificates will be provided to all student volunteers.",
    content: "Gathering Point: Main Campus Garden\nTime: 8:00 AM onwards\nBring: Water bottles and gardening gloves (if you have them). Let's plant 500 saplings together!"
  }
];

export const mockEvents = [
  {
    id: "e1",
    title: "HackFest 2026: 48-Hour Campus Hackathon",
    category: "Workshop",
    venue: "Main Auditorium & Innovation Lab",
    date: "2026-07-03",
    time: "06:00 PM - July 05, 06:00 PM",
    organizer: "Department of Computer Science & ACM Student Chapter",
    description: "HackFest is back! Compile your teams, brainstorm ideas, and build functional prototypes within 48 hours. Focus tracks include AI & Machine Learning, Sustainable Tech, Web3, and Open Innovation. Exciting cash prizes, internships, and goodies to be won! Food and energy drinks will be provided 24/7.",
    rsvps: 245,
    maxCapacity: 300,
    tags: ["Hackathon", "Coding", "AI", "Prizes"]
  },
  {
    id: "e2",
    title: "Music Concert: Rock the Night 2026",
    category: "Cultural",
    venue: "Open Air Theatre (OAT)",
    date: "2026-07-10",
    time: "07:30 PM - 11:30 PM",
    organizer: "Cultural Committee",
    description: "Get ready for the biggest musical event of the semester! Feat. popular indie rock band 'The Sonic Waves' along with opening performances by our own student bands. Entry is free for all students, faculty, and alumni. Bring your friends and experience a night of high energy, great food stalls, and incredible music.",
    rsvps: 582,
    maxCapacity: 1000,
    tags: ["Music", "Concert", "Rock", "FoodStalls"]
  },
  {
    id: "e3",
    title: "Guest Lecture: The Future of Quantum Computing",
    category: "Academic",
    venue: "Seminar Hall 2, Block-C",
    date: "2026-06-29",
    time: "10:30 AM - 12:00 PM",
    organizer: "Physics and Computation Department",
    description: "Dr. Elena Vance, Senior Quantum Architect at IBM Research, will deliver an insightful lecture on recent breakthroughs in superconducting quantum processors, quantum error correction, and the timeline for quantum supremacy in practical applications. A Q&A session will follow the lecture.",
    rsvps: 112,
    maxCapacity: 150,
    tags: ["Quantum", "Physics", "Research", "Tech"]
  },
  {
    id: "e4",
    title: "Campus Football Derby: FC Science vs FC Tech",
    category: "Sports",
    venue: "Main Sports Stadium",
    date: "2026-06-28",
    time: "04:30 PM - 06:30 PM",
    organizer: "Sports Department",
    description: "The ultimate clash! The annual football rivalry matches the School of Sciences against the School of Technology. Come cheer for your school in what promises to be an intense and action-packed game. Last year, FC Science won in a penalty shootout. Can FC Tech claim revenge?",
    rsvps: 340,
    maxCapacity: 800,
    tags: ["Football", "Sports", "Rivalry", "Match"]
  },
  {
    id: "e5",
    title: "Resume Building & Interview Prep Bootcamp",
    category: "Career",
    venue: "Career Center, Main Building",
    date: "2026-06-30",
    time: "02:00 PM - 05:00 PM",
    organizer: "Career Development & Placement Cell",
    description: "Getting ready for placement season? This bootcamp will teach you how to write resumes that pass ATS filters, structure stories for behavioral interviews using the STAR method, and handle tricky technical questions. Get 1-on-1 resume reviews from industry veterans.",
    rsvps: 198,
    maxCapacity: 200,
    tags: ["Resume", "Placement", "Interview", "Career"]
  },
  {
    id: "e6",
    title: "TedXCampus: Ideas Worth Spreading",
    category: "Social",
    venue: "Main Auditorium",
    date: "2026-07-15",
    time: "09:00 AM - 04:00 PM",
    organizer: "TedXCampus Student Org",
    description: "TEDxCampus returns with the theme 'Breaking Barriers'. We have an amazing lineup of 8 speakers, including climate activists, startup founders, renowned researchers, and a musical prodigy, sharing their unique ideas and stories. Standard passes include lunch and merchandise.",
    rsvps: 450,
    maxCapacity: 500,
    tags: ["TEDx", "Inspiration", "Talks", "Networking"]
  },
  {
    id: "e7",
    title: "Blood Donation Camp & Free Health Checkup",
    category: "Social",
    venue: "Student Activity Center (SAC)",
    date: "2026-07-01",
    time: "09:00 AM - 04:30 PM",
    organizer: "Red Cross Student Wing & Campus Health Center",
    description: "Give blood, save lives! Join the annual blood donation drive. The Red Cross is setting up donation beds at the SAC. Free basic health screening (Blood pressure, sugar level, BMI, and blood grouping) is also available to all students. All donors will receive fresh juice, snacks, and a certificate of appreciation.",
    rsvps: 156,
    maxCapacity: 400,
    tags: ["Health", "SocialWork", "BloodDonation", "Volunteering"]
  }
];
