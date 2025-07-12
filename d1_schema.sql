DROP TABLE IF EXISTS query_log;
CREATE TABLE query_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  query_input TEXT,
  query_response TEXT,
  coins_spent INTEGER NOT NULL,
  is_team_query BOOLEAN DEFAULT FALSE,
  team_id TEXT,
  timestamp TEXT NOT NULL
);