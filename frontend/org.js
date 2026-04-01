async function loadVolunteers() {

  const res = await fetch("http://localhost:5000/api/volunteer/suggested/beach");
  const data = await res.json();

  const container = document.getElementById("volunteerList");
  container.innerHTML = "";

  data.forEach(v => {
    const card = `
      <div class="card">
        <h3>${v.location}</h3>
        <p>${v.story}</p>
        <p>Availability: ${v.availability}</p>
        <p>Match Score: ${v.match_score}%</p>
      </div>
    `;

    container.innerHTML += card;
  });
}

loadVolunteers();