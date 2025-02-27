from flask import Flask, render_template, request, session, redirect, url_for

app = Flask(__name__, template_folder="templates")
app.secret_key = 'secret_key'

positions = {
    "Entry-Level Python Engineer": {
        "needed_skills": ["Python course work", "Software Engineering course work"],
        "desired_skills": ["Agile course"],
        "qualifications": ["Bachelor in Computer Science"]
    },
    "Python Engineer": {
        "needed_skills": ["3 years Python development", "1 year data development", "Experience in Agile projects"],
        "desired_skills": ["Used Git"],
        "qualifications": ["Bachelor in Computer Science"]
    },
    "Project Manager": {
        "needed_skills": ["3 years managing software projects", "2 years in Agile projects"],
        "qualifications": ["PMI Lean Project Management Certification"]
    },
    "Senior Knowledge Engineer": {
        "needed_skills": ["3 years using Python to develop Expert Systems", "2 years data architecture and development"],
        "qualifications": ["Masters in Computer Science"]
    }
}

questions = [
    ('position', "What position are you applying for?", list(positions.keys())),
    ('education', "What is your educational background?", ["Bachelor in Computer Science", "Masters in Computer Science", "PMI Lean Project Management Certification", "Other"]),
    ('experience', "What work experience do you have?", [
        "3 years Python development", "1 year data development",
        "Experience in Agile projects", "Used Git", "3 years managing software projects", "2 years in Agile projects",
        "3 years using Python to develop Expert Systems", "2 years data architecture and development", "Agile course"
    ])
]

@app.route('/')
def start():
    session.clear()
    session['question_index'] = 0
    session['responses'] = {}
    return redirect(url_for('question'))

@app.route('/question', methods=['GET', 'POST'])
def question():
    index = session.get('question_index', 0)
    
    if index >= len(questions):
        return redirect(url_for('evaluate'))
    
    key, prompt, options = questions[index]
    
    if request.method == 'POST':
        response = request.form.getlist('response')
        session['responses'][key] = response
        session['question_index'] = index + 1
        return redirect(url_for('question'))
    
    return render_template('question.html', prompt=prompt, options=options, index=index + 1, total=len(questions))

@app.route('/evaluate')
def evaluate():
    responses = session.get('responses', {})
    qualified_positions = []
    
    for position, criteria in positions.items():
        if position in responses.get("position", []):
            education_met = any(q in responses.get("education", []) for q in criteria.get("qualifications", []))
            additional_education_met = "PMI Lean Project Management Certification" in responses.get("education", [])
            if (education_met or additional_education_met) and \
               all(skill in responses.get("experience", []) for skill in criteria.get("needed_skills", [])):
                qualified_positions.append(position)
    
    return render_template('result.html', qualified_positions=qualified_positions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=0, debug=True)




