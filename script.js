// Job Qualification Logic
const positions = {
    "Entry-Level Python Engineer": {
        needed_skills: ["Python course work", "Software Engineering course work"],
        qualifications: ["Bachelor in Computer Science"]
    },
    "Python Engineer": {
        needed_skills: ["3 years Python development", "1 year data development", "Experience in Agile projects"],
        qualifications: ["Bachelor in Computer Science"],
        beneficial_skills: ["Used Git"]
    },
    "Project Manager": {
        needed_skills: ["3 years managing software projects", "2 years in Agile projects"],
        qualifications: ["PMI Lean Project Management Certification"]
    },
    "Senior Knowledge Engineer": {
        needed_skills: ["3 years using Python to develop Expert Systems", "2 years data architecture and development"],
        qualifications: ["Masters in Computer Science"]
    }
};

// Questions to Ask
const questions = [
    { key: "position", text: "What position are you applying for?", options: Object.keys(positions) },
    { key: "education", text: "What is your educational background?", options: ["Bachelor in Computer Science", "Masters in Computer Science", "PMI Lean Project Management Certification", "Other"] },
    { key: "experience", text: "What work experience do you have?", options: [
        "Python course work", "Software Engineering course work", "3 years Python development", "1 year data development",
        "Experience in Agile projects", "Used Git", "3 years managing software projects", "2 years in Agile projects",
        "3 years using Python to develop Expert Systems", "2 years data architecture and development", "Agile course"
    ]}
];

let responses = {};
let currentQuestion = 0;

// Display First Question
function displayQuestion() {
    const questionObj = questions[currentQuestion];
    document.getElementById("question-text").innerText = questionObj.text;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionObj.options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => saveResponse(questionObj.key, option);
        optionsContainer.appendChild(btn);
    });
}

// Save Response and Move to Next Question
function saveResponse(key, value) {
    if (!responses[key]) {
        responses[key] = [];
    }
    responses[key].push(value);
}

// Move to the Next Question or Show Result
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        evaluateApplication();
    }
}

// Check Qualifications
function evaluateApplication() {
    let qualifiedPositions = [];

    for (const [position, criteria] of Object.entries(positions)) {
        const hasEducation = criteria.qualifications.some(q => responses.education?.includes(q));
        const hasSkills = criteria.needed_skills.every(skill => responses.experience?.includes(skill));

        if (hasEducation && hasSkills) {
            qualifiedPositions.push(position);
        }
    }

    document.getElementById("question-container").innerHTML = qualifiedPositions.length > 0
        ? `<h2>Congratulations! You qualify for:</h2><ul>${qualifiedPositions.map(p => `<li>${p}</li>`).join('')}</ul>`
        : `<h2>Sorry, you do not meet the necessary qualifications.</h2>`;
}

// Start the questionnaire
displayQuestion();
