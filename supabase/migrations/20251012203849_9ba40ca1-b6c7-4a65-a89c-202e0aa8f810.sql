-- Generate random profile views for test user (test1@gmail.com)
-- Insert profile views from various users over the past 30 days

INSERT INTO profile_views (viewer_id, viewed_profile_id, viewed_at, created_at)
VALUES 
  -- Recent views (last few hours)
  ('e083ef67-00b6-4f34-970b-48988fdefad0', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '15 minutes', now() - interval '15 minutes'),
  ('0f30992b-008b-4fd8-b5e9-8757034bafa0', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '45 minutes', now() - interval '45 minutes'),
  ('975ca259-7778-4cec-a2a7-62fd2db11a74', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '2 hours', now() - interval '2 hours'),
  ('7aab876c-d62a-4c3e-95f6-d19cd6dd7210', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '5 hours', now() - interval '5 hours'),
  
  -- Yesterday
  ('755e27e4-a2f3-4931-8bb7-e3f5567a419f', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '1 day', now() - interval '1 day'),
  ('b632d475-35aa-40ed-8be3-b0f908cdda23', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '1 day 8 hours', now() - interval '1 day 8 hours'),
  
  -- 2-7 days ago
  ('4ff21280-ebb2-4c95-b5d4-0a88225eb24b', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '2 days', now() - interval '2 days'),
  ('77159ebe-2df4-4689-8d44-8c5b9da23e14', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '3 days', now() - interval '3 days'),
  ('b09c86b6-3da6-4050-87e5-3a45fa2baeb3', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '4 days', now() - interval '4 days'),
  ('10c6badc-7ee8-4715-aac1-e701bf91a6fb', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '5 days', now() - interval '5 days'),
  
  -- 1-4 weeks ago
  ('a918c762-a011-4c28-bed1-ae6b96d608b8', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '8 days', now() - interval '8 days'),
  ('c704b683-b0bb-4fad-a37f-4b4e05b52184', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '12 days', now() - interval '12 days'),
  ('37d0d9bf-1c8a-4930-bc16-c95520a46ebe', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '18 days', now() - interval '18 days'),
  ('5e65b6b8-e6c9-4d50-8d71-a33717cee052', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '23 days', now() - interval '23 days'),
  ('cab52149-46db-4afa-85c7-a55ad9952165', 'd5fe7a9c-cfce-4f9c-a4c1-9e7e35843f80', now() - interval '28 days', now() - interval '28 days')
ON CONFLICT DO NOTHING;