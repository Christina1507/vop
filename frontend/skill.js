async function submitProfile() {

  const data = {
    name: document.querySelectorAll("input")[0].value,
    email: document.querySelectorAll("input")[1].value,
    location: document.querySelectorAll("input")[2].value,
    skills: document.querySelectorAll("input")[3].value.split(","),
    availability: document.querySelector("select").value,
    story: document.querySelector("textarea").value,
    category: "skill"
  };

  await fetch("http://localhost/api/volunteer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  alert("Skill profile submitted 🤝");
}
