SET session_replication_role = replica;

--
-- Data for Name: poc_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."poc_documents" ("id", "slug", "title", "path", "tags", "created_at") VALUES
('2f725959-1813-4be5-8768-1361b5de5fa6', NULL, 'Product Specification', NULL, '{}', '2025-04-18 15:49:07.651015+00'),
('fcfd3ac4-d830-4f5f-a71e-f1123cdc478e', NULL, 'Product Specification', NULL, '{}', '2025-04-18 15:49:27.070453+00'),
('6b4a2083-f55e-45aa-96b5-1d0139062eb2', NULL, 'Product Specification', NULL, '{}', '2025-04-18 15:50:18.80503+00'),
('1ca6e32a-fae0-4c0f-ad2c-979d36f4d3df', NULL, 'Blank Document', NULL, '{}', '2025-04-18 15:56:31.880807+00'),
('6a68a7f1-1c74-42ea-92c7-8e8ac9aa6195', NULL, 'Product Specification', NULL, '{}', '2025-04-18 15:57:03.749111+00'),
('7a71ac45-ba7f-4926-bb3a-2ff4cefe2c4e', NULL, 'Product Specification', NULL, '{}', '2025-04-18 15:58:51.190701+00'),
('c6a6b39c-37f2-48f2-a6c5-ac9b3e0b5e95', NULL, 'Product Specification', NULL, '{}', '2025-04-18 16:01:01.310262+00'),
('b4dd35ff-1dcb-4a9e-9485-904b9dca1b9d', NULL, 'Product Specification', NULL, '{}', '2025-04-18 16:03:55.09341+00'),
('9313b174-1c5d-41e2-84dc-3b7274fe648c', NULL, 'Product Specification', NULL, '{}', '2025-04-18 16:04:55.837544+00'),
('1da30ef8-9a05-4142-92b8-0c992731c930', NULL, 'Product Specification', NULL, '{}', '2025-04-18 16:11:10.267941+00'),
('fc137b09-2d86-41a9-8eb4-befda1ed6c88', NULL, 'Product Specification', NULL, '{}', '2025-04-18 16:20:36.235873+00'),
('f8ebc289-405b-466d-a05a-2711b99d6adb', NULL, 'Product Specification', NULL, '{}', '2025-04-18 16:22:24.361559+00'),
('bb4a6877-a600-4d2e-99f2-b3087c9d4764', NULL, 'Strategy Email', NULL, '{}', '2025-04-18 16:26:33.402236+00');

--
-- Data for Name: poc_document_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."poc_document_versions" ("id", "doc_id", "yjs_state", "diff", "author", "created_at") VALUES
('b21084c5-8021-4eed-922e-f4e25b514d54', 'b4dd35ff-1dcb-4a9e-9485-904b9dca1b9d', NULL, NULL, NULL, '2025-04-18 16:03:55.215722+00'),
('6775815b-4aa1-4f1b-9ee4-c263b1ad89b9', '9313b174-1c5d-41e2-84dc-3b7274fe648c', NULL, NULL, NULL, '2025-04-18 16:04:55.934368+00'),
('8a6e3428-d426-486f-b20b-c3cdaf64ae34', '1da30ef8-9a05-4142-92b8-0c992731c930', NULL, NULL, NULL, '2025-04-18 16:11:10.331456+00'),
('0b5f3558-21e4-4c3b-8f8d-970496ce6c72', 'fc137b09-2d86-41a9-8eb4-befda1ed6c88', NULL, NULL, NULL, '2025-04-18 16:20:36.317222+00'),
('5d8d035c-3df1-44c2-b96d-a80add73835c', 'f8ebc289-405b-466d-a05a-2711b99d6adb', NULL, NULL, NULL, '2025-04-18 16:22:24.429833+00'),
('8f66f308-a709-4b85-9d90-80fe5a4bf1f6', 'bb4a6877-a600-4d2e-99f2-b3087c9d4764', NULL, NULL, NULL, '2025-04-18 16:26:33.51291+00');

--
-- Data for Name: poc_draft_diffs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."poc_draft_diffs" ("id", "doc_id", "diff", "status", "created_at") VALUES
('82496d0a-7bd3-4dfb-826f-98f4f35a1999', '9313b174-1c5d-41e2-84dc-3b7274fe648c', '{"to": "improved: User Stories", "pos": 148, "from": "User Stories", "length": 12, "rationale": "AI suggested this improvement for clarity."}', 'pending', '2025-04-18 16:10:50.184134+00'),
('fdf3ca1e-d4a3-49f0-90d1-f93dd6704408', '1da30ef8-9a05-4142-92b8-0c992731c930', '{"to": "improved: Features & Requirements", "pos": 217, "from": "Features & Requirements", "length": 23, "rationale": "AI suggested this improvement for clarity."}', 'pending', '2025-04-18 16:11:29.067293+00'),
('9ee60041-73e6-406b-92b0-5f2b6f6ff9a9', '1da30ef8-9a05-4142-92b8-0c992731c930', '{"to": "improved: Features & Requirements", "pos": 217, "from": "Features & Requirements", "length": 23, "rationale": "AI suggested this improvement for clarity."}', 'pending', '2025-04-18 16:11:33.04672+00'),
('975b279d-dcdc-43a4-8063-3b242c88b6d5', '1da30ef8-9a05-4142-92b8-0c992731c930', '{"to": "improved: Features & Requirements", "pos": 217, "from": "Features & Requirements", "length": 23, "rationale": "AI suggested this improvement for clarity."}', 'pending', '2025-04-18 16:11:39.439435+00'),
('c062dd0f-3b30-4207-8a5f-3da0b967465e', 'fc137b09-2d86-41a9-8eb4-befda1ed6c88', '{"to": "improved: oblem Statement", "pos": 92, "from": "oblem Statement", "length": 15, "rationale": "AI suggested this improvement for clarity."}', 'pending', '2025-04-18 16:20:39.037046+00'),
('f4fe33e7-3f4c-4ef5-aaa3-44f59021cb20', 'fc137b09-2d86-41a9-8eb4-befda1ed6c88', '{"to": "improved: blem Statement", "pos": 103, "from": "blem Statement", "length": 16, "rationale": "AI suggested this improvement for clarity."}', 'pending', '2025-04-18 16:20:57.440344+00'),
('fdfdbb19-6a37-426f-98a4-840c1d90c675', 'f8ebc289-405b-466d-a05a-2711b99d6adb', '{"to": "improved: User Stories", "pos": 148, "from": "User Stories", "length": 12, "rationale": "AI suggested this improvement for clarity."}', 'pending', '2025-04-18 16:22:27.029066+00'),
('a5a5e140-641a-4581-9209-48c734d76b1f', 'f8ebc289-405b-466d-a05a-2711b99d6adb', '{"to": "improved: Features & Requirements", "pos": 217, "from": "Features & Requirements", "length": 23, "rationale": "AI suggested this improvement for clarity."}', 'pending', '2025-04-18 16:25:18.920321+00');

SET session_replication_role = origin; 