Create database hackathon;

-- TEAM
CREATE TABLE Team (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(100),
    leader_name VARCHAR(100),
    email VARCHAR(100),
    contact_number VARCHAR(15)
);
           
-- PARTICIPANT
CREATE TABLE Participant_details (
    participant_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(50),
    FOREIGN KEY (team_id) REFERENCES Team(team_id)
);

-- HACKATHON
CREATE TABLE Hackathon_details (
    hackathon_id INT PRIMARY KEY AUTO_INCREMENT,
    Fullname VARCHAR(100),
    start_date DATE,
    end_date DATE,
    submission_deadline DATE
);

-- SUBMISSION
CREATE TABLE Submission (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT,
    hackathon_id INT,
    project_title VARCHAR(100),
    submission_link VARCHAR(255),
    submitted_on DATE,
    FOREIGN KEY (team_id) REFERENCES Team(team_id),
    FOREIGN KEY (hackathon_id) REFERENCES Hackathon(hackathon_id)
);

-- JUDGE
CREATE TABLE Judge (
    judge_id INT PRIMARY KEY AUTO_INCREMENT,
    Fullname VARCHAR(100),
    email VARCHAR(100),
    expertise VARCHAR(100)
);

-- EVALUATION
CREATE TABLE Evaluation (
    evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
    judge_id INT,
    submission_id INT,
    score DECIMAL(4,2),
    remarks varchar(),
    FOREIGN KEY (judge_id) REFERENCES Judge(judge_id),
    FOREIGN KEY (submission_id) REFERENCES Submission(submission_id)
);

-- PRIZE
CREATE TABLE Prize (
    prize_id INT PRIMARY KEY AUTO_INCREMENT,
    hackathon_id INT,
    rank_ INT,
    team_id INT,
    amount DECIMAL(10,2),
    FOREIGN KEY (hackathon_id) REFERENCES Hackathon(hackathon_id),
    FOREIGN KEY (team_id) REFERENCES Team(team_id)
);

INSERT INTO Team (team_id, team_name, leader_name, email, contact_number) VALUES
(1, 'Team Alpha', 'Alice', 'alice@alpha.com', '9991110001'),
(2, 'Team Beta', 'Bob', 'bob@beta.com', '9991110002'),
(3, 'Team Gamma', 'Carol', 'carol@gamma.com', '9991110003'),
(4, 'Team Delta', 'David', 'david@delta.com', '9991110004'),
(5, 'Team Epsilon', 'Eve', 'eve@epsilon.com', '9991110005');

INSERT INTO Participant (participant_id, team_id, name, email, role) VALUES
(1, 1, 'P1', 'p1@mail.com', 'Leader'),
(2, 1, 'P2', 'p2@mail.com', 'Developer'),
(3, 1, 'P3', 'p3@mail.com', 'Designer'),
(4, 1, 'P4', 'p4@mail.com', 'Tester'),
(5, 1, 'P5', 'p5@mail.com', 'Researcher'),
(6, 2, 'P6', 'p6@mail.com', 'Leader'),
(7, 2, 'P7', 'p7@mail.com', 'Developer'),
(8, 2, 'P8', 'p8@mail.com', 'Designer'),
(9, 2, 'P9', 'p9@mail.com', 'Tester'),
(10, 2, 'P10', 'p10@mail.com', 'Researcher'),
(11, 3, 'P11', 'p11@mail.com', 'Leader'),
(12, 3, 'P12', 'p12@mail.com', 'Developer'),
(13, 3, 'P13', 'p13@mail.com', 'Designer'),
(14, 3, 'P14', 'p14@mail.com', 'Tester'),
(15, 3, 'P15', 'p15@mail.com', 'Researcher'),
(16, 4, 'P16', 'p16@mail.com', 'Leader'),
(17, 4, 'P17', 'p17@mail.com', 'Developer'),
(18, 4, 'P18', 'p18@mail.com', 'Designer'),
(19, 4, 'P19', 'p19@mail.com', 'Tester'),
(20, 4, 'P20', 'p20@mail.com', 'Researcher'),
(21, 5, 'P21', 'p21@mail.com', 'Leader'),
(22, 5, 'P22', 'p22@mail.com', 'Developer'),
(23, 5, 'P23', 'p23@mail.com', 'Designer'),
(24, 5, 'P24', 'p24@mail.com', 'Tester'),
(25, 5, 'P25', 'p25@mail.com', 'Researcher');

INSERT INTO Hackathon (hackathon_id, name, start_date, end_date, submission_deadline) VALUES
(1, 'CodeFest', '2025-06-01', '2025-06-05', '2025-06-04'),
(2, 'HackX', '2025-07-10', '2025-07-15', '2025-07-14'),
(3, 'InnoHack', '2025-08-01', '2025-08-03', '2025-08-02'),
(4, 'TechJam', '2025-09-01', '2025-09-05', '2025-09-04'),
(5, 'HackSprint', '2025-10-10', '2025-10-12', '2025-10-11');

INSERT INTO Submission (submission_id, team_id, hackathon_id, project_title, description, submission_link, submitted_on) VALUES
(1, 1, 1, 'SmartBin', 'Smart waste management system.', 'http://link1.com', '2025-06-03'),
(2, 2, 2, 'EcoTrack', 'Track carbon footprint.', 'http://link2.com', '2025-07-13'),
(3, 3, 3, 'EduBot', 'AI tutor bot.', 'http://link3.com', '2025-08-01'),
(4, 4, 4, 'SafeDrive', 'Driving assistant app.', 'http://link4.com', '2025-09-03'),
(5, 5, 5, 'AgroAid', 'Farmer support tool.', 'http://link5.com', '2025-10-10');
INSERT INTO Judge (judge_id, name, email, expertise) VALUES
(1, 'Dr. Smith', 'smith@judge.com', 'AI'),
(2, 'Dr. Jane', 'jane@judge.com', 'IoT'),
(3, 'Dr. Leo', 'leo@judge.com', 'Cybersecurity'),
(4, 'Dr. Amy', 'amy@judge.com', 'Education'),
(5, 'Dr. Max', 'max@judge.com', 'Agritech');

INSERT INTO Evaluation (evaluation_id, judge_id, submission_id, score, remarks) VALUES
(1, 1, 1, 85, 'Innovative project.'),
(2, 2, 2, 90, 'Excellent idea.'),
(3, 3, 3, 88, 'Good implementation.'),
(4, 4, 4, 92, 'User-friendly UI.'),
(5, 5, 5, 95, 'Highly impactful.');

INSERT INTO Prize (prize_id, hackathon_id, rank, team_id, amount) VALUES
(1, 1, 1, 5, 10000.0),
(2, 2, 1, 2, 8000.0),
(3, 3, 1, 4, 9000.0),
(4, 4, 1, 1, 11000.0),
(5, 5, 1, 3, 9500.0);


SELECT hackathon_id, Fullname, DATEDIFF(end_date, start_date) AS duration_days
FROM hackathon_details;


SELECT name, email, role
FROM participant_details
WHERE team_id = 3;

SELECT Fullname, email
FROM judge
WHERE expertise LIKE '%AI%';

SELECT project_title, team_id, submitted_on
FROM submission
WHERE hackathon_id = 2;

SELECT hackathon_id, SUM(amount) AS total_prize
FROM prize
GROUP BY hackathon_id;

SELECT s.team_id, AVG(e.score) AS avg_score
FROM submission s
JOIN evaluation e ON s.submission_id = e.submission_id
GROUP BY s.team_id;

SELECT DISTINCT p.team_id
FROM participant_details p
LEFT JOIN prize pr ON p.team_id = pr.team_id
WHERE pr.team_id IS NULL;


SELECT team_id, amount
FROM prize
ORDER BY amount DESC
LIMIT 3;









