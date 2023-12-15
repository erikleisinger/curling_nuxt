CREATE OR REPLACE FUNCTION calculate_lose_streak_badges()
RETURNS TRIGGER AS $$
DECLARE
    games_count integer;
    loss_value integer;
    lose_streak_2 boolean := true;
    lose_streak_3 boolean := true;
    lose_streak_4 boolean := true;
      lose_streak_5 boolean := true;
    lose_streak_6 boolean := true;
    lose_streak_7 boolean := true;
      lose_streak_8 boolean := true;
    lose_streak_9 boolean := true;
    lose_streak_10 boolean := true;
BEGIN
    IF NEW.team_id IS NOT NULL THEN
        -- Count the number of rows
        SELECT COUNT(*) INTO games_count
        FROM (
            SELECT ts.loss
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            GROUP BY ts.loss, games.start_time
            ORDER BY games.start_time desc
        ) AS subquery;

        RAISE LOG 'games count: %', games_count;

        
        IF games_count > 1 
        AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_2' AND team_id = NEW.team_id)
        THEN 
          FOR i IN 1..2 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 2 OFFSET i;

            IF loss_value = 0 THEN
            lose_streak_2 := false
              EXIT;
            ELSE
            END IF;
          END LOOP;
        ELSE 
           lose_streak_2 := false;
           
        END IF;

        IF (lose_streak_2) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_2', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_2', 'badge_earned');
        END IF;

        IF games_count > 2 
        AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_3' AND team_id = NEW.team_id)
        THEN 
          FOR i IN 1..3 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 3 OFFSET i;
            
            RAISE LOG 'value of loss: %, index: %', loss_value, i;
            IF loss_value = 0 THEN
            lose_streak_3 := false
            EXIT;
              
            END IF;
          END LOOP;
          
        ELSE
            lose_streak_3 := false;
        END IF;

        IF (lose_streak_3) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_3', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_3', 'badge_earned');
        END IF;

        IF games_count > 3 
        AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_4' AND team_id = NEW.team_id)
        THEN 
          FOR i IN 1..4 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 4 OFFSET i;

            IF loss_value = 0 THEN
            lose_streak_4 := false;
              EXIT;
            END IF;
          END LOOP;
        ELSE 
          lose_streak_4 := false;
        END IF;

        IF (lose_streak_4) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_4', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_4', 'badge_earned');
        END IF;

           IF games_count > 4 
           AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_5' AND team_id = NEW.team_id)
           THEN 
          FOR i IN 1..4 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 5 OFFSET i;

            IF loss_value = 0 THEN
            lose_streak_5 := false;
              EXIT;
            END IF;
          END LOOP;
        ELSE 
          lose_streak_5 := false;
        END IF;

        IF (lose_streak_5) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_5', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_5', 'badge_earned');
        END IF;

           IF games_count > 5 
           AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_6' AND team_id = NEW.team_id)
           THEN 
          FOR i IN 1..4 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 6 OFFSET i;

            IF loss_value = 0 THEN
            lose_streak_6 := false;
              EXIT;
            END IF;
          END LOOP;
        ELSE 
          lose_streak_6 := false;
        END IF;

        IF (lose_streak_6) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_6', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_6', 'badge_earned');
        END IF;

                   IF games_count > 6 
                   AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_7' AND team_id = NEW.team_id)
                   THEN 
          FOR i IN 1..4 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 7 OFFSET i;

            IF loss_value = 0 THEN
            lose_streak_7 := false;
              EXIT;
            END IF;
          END LOOP;
        ELSE 
          lose_streak_7 := false;
        END IF;

        IF (lose_streak_7) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_7', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_7', 'badge_earned');
        END IF;

                   IF games_count > 7                    
                   AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_8' AND team_id = NEW.team_id)
                   THEN 
          FOR i IN 1..4 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 8 OFFSET i;

            IF loss_value = 0 THEN
            lose_streak_8 := false;
              EXIT;
            END IF;
          END LOOP;
        ELSE 
          lose_streak_8 := false;
        END IF;

        IF (lose_streak_8) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_8', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_8', 'badge_earned');
        END IF;

                   IF games_count > 8 
                   AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_9' AND team_id = NEW.team_id)
                   THEN 
          FOR i IN 1..4 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 9 OFFSET i;

            IF loss_value = 0 THEN
            lose_streak_9 := false;
              EXIT;
            END IF;
          END LOOP;
        ELSE 
          lose_streak_9 := false;
        END IF;

        IF (lose_streak_9) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_9', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_9', 'badge_earned');
        END IF;

                   IF games_count > 9 
                   AND NOT EXISTS (SELECT id FROM badges WHERE name = 'lose_streak_10' AND team_id = NEW.team_id)
                   
                   THEN 
          FOR i IN 1..4 LOOP
            SELECT loss INTO loss_value
            FROM team_stats ts
            JOIN games ON games.id = ts.game_id
            WHERE ts.team_id = NEW.team_id
            ORDER BY games.start_time desc
            LIMIT 10 OFFSET i;

            IF loss_value = 0 THEN
            lose_streak_10 := false;
              EXIT;
            END IF;
          END LOOP;
        ELSE 
          lose_streak_10 := false;
        END IF;

        IF (lose_streak_10) THEN
            INSERT INTO badges (team_id, name, earned)
            VALUES (NEW.team_id, 'lose_streak_10', TRUE);
            INSERT INTO achievements (team_id, name, type)
            VALUES (NEW.team_id, 'lose_streak_10', 'badge_earned');
        END IF;

        RAISE LOG 'lose_streak_2: %', lose_streak_2;
        RAISE LOG 'lose_streak_3: %', lose_streak_3;
        RAISE LOG 'lose_streak_4: %', lose_streak_4;
          RAISE LOG 'lose_streak_5: %', lose_streak_5;
        RAISE LOG 'lose_streak_6: %', lose_streak_6;
        RAISE LOG 'lose_streak_7: %', lose_streak_7;
          RAISE LOG 'lose_streak_8: %', lose_streak_8;
        RAISE LOG 'lose_streak_9: %', lose_streak_9;
        RAISE LOG 'lose_streak_10: %', lose_streak_10;
 
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;