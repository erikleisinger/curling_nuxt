CREATE OR REPLACE FUNCTION update_hammer_team()
RETURNS TRIGGER AS $$
DECLARE
  prev_end_id INTEGER;
  prev_scoring_team_id INTEGER;
BEGIN
  prev_end_id := (SELECT id FROM ends WHERE game_id = NEW.game_id AND end_number = NEW.end_number - 1 ORDER BY id DESC LIMIT 1);

IF prev_end_id IS NULL THEN
  NEW.hammer_team_id := (
    SELECT COALESCE(
      CASE 
        WHEN hammer_first_end = home THEN away
        WHEN hammer_first_end = away THEN home
      END,
      home_team_id  -- Default to home_team_id when hammer_first_end is not matched
    )
    FROM games
    WHERE id = NEW.game_id
  );
ELSE

      IF prev_scoring_team_id IS NOT NULL THEN
        NEW.hammer_team_id := (
          SELECT CASE 
            WHEN home = prev_scoring_team_id THEN away
            ELSE home
          END
          FROM games
          WHERE id = NEW.game_id
        );
      ELSE
        WHILE prev_end_id IS NOT NULL AND prev_scoring_team_id IS NULL LOOP
          prev_scoring_team_id := (SELECT scoring_team_id FROM ends WHERE id = prev_end_id);
          prev_end_id := (SELECT id FROM ends WHERE game_id = NEW.game_id AND end_number = (SELECT end_number FROM ends WHERE id = prev_end_id) - 1 ORDER BY id DESC LIMIT 1);
        END LOOP;

        IF prev_scoring_team_id IS NOT NULL THEN
          NEW.hammer_team_id := (
            SELECT CASE 
              WHEN home = prev_scoring_team_id THEN away
              ELSE home
            END
            FROM games
            WHERE id = NEW.game_id
          );
        ELSE
          NEW.hammer_team_id := (SELECT CASE WHEN hammer_first_end = away THEN home ELSE away END FROM games WHERE id = NEW.game_id);
        END IF;
      END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;





