
-- Deduplicate: keep only the newest is_current=true row per product
UPDATE prompt_versions
SET is_current = false
WHERE id IN (
  SELECT id FROM (
    SELECT id, product, created_at,
      ROW_NUMBER() OVER (PARTITION BY product ORDER BY created_at DESC) as rn
    FROM prompt_versions
    WHERE is_current = true
  ) ranked
  WHERE rn > 1
);
