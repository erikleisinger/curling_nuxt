(
   (
      EXISTS (
         SELECT
            1
         FROM
            team_profile_junction tpj
         WHERE
            (
               (tpj.team_id = game_team_junction.team_id)
               AND (tpj.profile_id = auth.uid())
            )
      )
   )
   OR (
      (
         NOT (
            EXISTS (
               SELECT
                  1
               FROM
                  game_team_junction game_team_junction_1
               WHERE
                  (
                     game_team_junction_1.game_id = game_team_junction.game_id
                  )
            )
         )
      )
      OR (
         EXISTS (
            SELECT
               1
            FROM
               game_team_junction game_team_junction_1
            WHERE
               (
                  game_team_junction_1.team_id = game_team_junction.team_id
               )
         )
      )
   )
)