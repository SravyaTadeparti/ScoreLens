let courses = [
    { name: "Mathematics", professor: "Dr. Smith", description: "Advanced Algebra & Calculus" },
    { name: "Physics", professor: "Dr. Johnson", description: "Quantum Mechanics & Thermodynamics" },
    { name: "Computer Science", professor: "Prof. Allen", description: "Data Structures & Algorithms" }
];

document.addEventListener("DOMContentLoaded", function() {
    loadCourses();
});

function loadCourses() {
    let courseGrid = document.getElementById("course-selection");
    let courseList = document.getElementById("course-list");
    courseGrid.innerHTML = "";
    courseList.innerHTML = "";
    
    courses.forEach(course => {
        // Create Course Box (Main Content)
        let box = document.createElement("div");
        box.className = "course-box";
        box.innerHTML = `<h3>${course.name}</h3><p>${course.professor}</p><p>${course.description}</p>`;
        box.onclick = () => loadData(course.name);
        courseGrid.appendChild(box);

        // Create Sidebar Link
        let listItem = document.createElement("li");
        let link = document.createElement("a");
        link.href = "#";
        link.textContent = course.name;
        link.onclick = (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            loadData(course.name);
        };
        listItem.appendChild(link);
        courseList.appendChild(listItem);
    });
}

function loadData(course) {
    document.getElementById('course-title').innerText = course + " Scores";
    document.getElementById("course-selection").style.display = "none";
    document.getElementById("scoreChart").style.display = "block";

    const data = {
        'Mathematics': [78, 85, 90, 72, 88, 95],
        'Physics': [82, 75, 89, 91, 77, 84],
        'Computer Science': [92, 88, 94, 97, 85, 90]
    };
    renderChart(data[course]);
}

function renderChart(scores) {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6'],
            datasets: [{
                label: 'Scores',
                data: scores,
                borderColor: '#007BFF',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function joinClass() {
    alert("Feature to join a class will be implemented soon!");
}

function logout() {
    alert("Logging out...");
    window.location.href = "Login.html";
}
