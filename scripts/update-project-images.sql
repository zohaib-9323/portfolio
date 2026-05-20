-- Point project previews at Storage keys (after upload-project-images.mjs).
-- Also removes duplicate Goldium Crafter rows (keeps one).

-- 1) Preview images: use paths that match /public/assets/projects/ (app also maps legacy /assets/* automatically)
UPDATE projects SET image_url = '/assets/projects/capture-ai-dashboard.png'
WHERE title ILIKE '%capture%ai%' AND title NOT ILIKE '%landing%';

UPDATE projects SET image_url = '/assets/projects/capture-ai-landing-page.png'
WHERE title ILIKE '%capture%ai%' AND title ILIKE '%landing%';

UPDATE projects SET image_url = '/assets/projects/recordo-dashboard.png'
WHERE (title ILIKE '%recordo%' OR title ILIKE '%recodo%')
  AND (title ILIKE '%dashboard%' OR title ILIKE '%admin%')
  AND title NOT ILIKE '%landing%';

UPDATE projects SET image_url = '/assets/projects/recordo-landing-page.png'
WHERE (title ILIKE '%recordo%' OR title ILIKE '%recodo%')
  AND title ILIKE '%landing%';

UPDATE projects SET image_url = '/assets/projects/recipe-generator.png'
WHERE title ILIKE '%recipe%';

UPDATE projects SET image_url = '/assets/projects/goldium-crafter.png'
WHERE title ILIKE '%goldium%' OR title ILIKE '%goldiam%' OR (title ILIKE '%crafter%' AND (title ILIKE '%goldium%' OR title ILIKE '%goldiam%'));

UPDATE projects SET image_url = '/assets/projects/PPS.png'
WHERE title ILIKE '%pps%' OR title ILIKE '%police professional%';

UPDATE projects SET image_url = '/assets/projects/trade-harmonizer.png'
WHERE title ILIKE '%trade%harmon%';

-- 2) Remove duplicate Goldium rows (keep one: prefer non-landing, then newest)
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      ORDER BY
        CASE WHEN title ILIKE '%landing%' THEN 1 ELSE 0 END,
        created_at DESC NULLS LAST
    ) AS rn
  FROM projects
  WHERE title ILIKE '%goldium%'
     OR title ILIKE '%goldiam%'
     OR (title ILIKE '%crafter%' AND (title ILIKE '%goldium%' OR title ILIKE '%goldiam%'))
)
DELETE FROM projects
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);
