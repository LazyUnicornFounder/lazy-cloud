CREATE OR REPLACE FUNCTION public.clean_blog_markdown_headers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post RECORD;
  cleaned_content text[];
  para text;
  cleaned_para text;
BEGIN
  FOR post IN SELECT id, content FROM blog_posts WHERE array_to_string(content, ' ') ~ '##+'
  LOOP
    cleaned_content := '{}';
    FOREACH para IN ARRAY post.content
    LOOP
      -- Convert ## Header to <strong>Header</strong>
      cleaned_para := regexp_replace(para, '^#{1,6}\s*(.+)$', '<strong>\1</strong>', 'g');
      cleaned_para := trim(cleaned_para);
      IF cleaned_para <> '' THEN
        cleaned_content := array_append(cleaned_content, cleaned_para);
      END IF;
    END LOOP;
    UPDATE blog_posts SET content = cleaned_content WHERE id = post.id;
  END LOOP;
END;
$$;

SELECT public.clean_blog_markdown_headers();
DROP FUNCTION public.clean_blog_markdown_headers();