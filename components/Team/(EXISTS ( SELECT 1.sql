(EXISTS ( SELECT 1
   FROM events
  WHERE ((events.id = event_team_junction.event_id) AND ((events.profile_id = auth.uid()) OR (events.private = false)))))