
-- Unset all current prompts
UPDATE prompt_versions SET is_current = false;

-- Insert new v5 prompt versions (prompt_text will be set via individual inserts)
-- For now just mark the migration as the version bump
