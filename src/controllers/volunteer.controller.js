const pool = require("../config/db");
const { calculateMatch } = require("../services/match.service");


   //CREATE VOLUNTEER

exports.createVolunteer = async (req, res) => {
  try {
    const { name, email, location, skills, availability, story, category } = req.body;

    //  Insert into users table
    const userResult = await pool.query(
      `INSERT INTO users (name, email, role)
       VALUES ($1, $2, 'volunteer')
       RETURNING id`,
      [name, email]
    );

    const userId = userResult.rows[0].id;

    //  Insert into volunteer_profiles
    const profileResult = await pool.query(
      `INSERT INTO volunteer_profiles (user_id, location, availability, story, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, location, availability, story, category]
    );

    const profileId = profileResult.rows[0].id;

    //  Insert skills into skills table (if not exists)
    for (let skill of skills) {
      const skillResult = await pool.query(
        `INSERT INTO skills (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING
         RETURNING id`,
        [skill]
      );

      let skillId;

      if (skillResult.rows.length > 0) {
        skillId = skillResult.rows[0].id;
      } else {
        const existing = await pool.query(
          "SELECT id FROM skills WHERE name=$1",
          [skill]
        );
        skillId = existing.rows[0].id;
      }

      //  Link volunteer ↔ skill
      await pool.query(
        `INSERT INTO volunteer_skills (volunteer_id, skill_id)
         VALUES ($1, $2)`,
        [profileId, skillId]
      );
    }

    res.json({
      message: "Volunteer created successfully",
      profile: profileResult.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating volunteer");
  }
};


/* =========================
   GET VOLUNTEERS BY CATEGORY
========================= */
exports.getVolunteers = async (req, res) => {
  try {
    const category = req.params.category;

    const result = await pool.query(
      `SELECT vp.*, u.name, u.email
       FROM volunteer_profiles vp
       JOIN users u ON vp.user_id = u.id
       WHERE vp.category = $1`,
      [category]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching volunteers");
  }
};


/* =========================
   GET SUGGESTED VOLUNTEERS
========================= */
exports.getSuggested = async (req, res) => {
  try {
    const category = req.params.category;

    const result = await pool.query(
      `SELECT vp.*, u.name, u.email
       FROM volunteer_profiles vp
       JOIN users u ON vp.user_id = u.id
       WHERE vp.category = $1`,
      [category]
    );

    // add match score
    const volunteers = result.rows.map(v => ({
      ...v,
      match_score: calculateMatch(v, category)
    }));

    //  Sort highest match first
    volunteers.sort((a, b) => b.match_score - a.match_score);

    res.json(volunteers);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching suggested volunteers");
  }
};