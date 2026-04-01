function calculateMatch(volunteer, category) {
  let score = 0;

  // category match
  if (volunteer.category === category) {
    score += 30;
  }

  // skills match (simple logic for now)
  if (volunteer.skills && volunteer.skills.length > 0) {
    score += Math.min(volunteer.skills.length * 10, 30);
  }

  // availability
  if (volunteer.availability === "Weekend") {
    score += 20;
  }

  // strong story
  if (volunteer.story && volunteer.story.length > 40) {
    score += 20;
  }

  return Math.min(score, 100);
}

module.exports = { calculateMatch };