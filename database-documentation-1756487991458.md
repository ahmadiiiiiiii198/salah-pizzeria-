# Database Documentation
Generated on: 2025-08-29T17:19:51.457Z
Original Project: yliofvqfyimlbxjmsuow

## Tables Overview

### settings
Records: 46

| Column | Type | Sample Value |
|--------|------|--------------|
| key | string | galleryContent |
| value | json | {"heading":"La Nostra Galleria","subheading":"","b... |
| created_at | timestamp | 2025-08-20T16:26:03.603095+00:00 |
| updated_at | timestamp | 2025-08-26T22:10:25.642118+00:00 |

### categories
Records: 17

| Column | Type | Sample Value |
|--------|------|--------------|
| id | string | c38514e2-dc92-4628-8e40-a45cd2ac9403 |
| name | string | SEMPLICI |
| slug | string | semplici |
| description | string | Pizze classiche e tradizionali |
| image_url | nullable | null... |
| sort_order | integer | 1 |
| is_active | boolean | true |
| created_at | timestamp | 2025-08-20T16:27:30.400915+00:00 |
| updated_at | timestamp | 2025-08-20T16:27:30.400915+00:00 |

### products
Records: 127

| Column | Type | Sample Value |
|--------|------|--------------|
| id | string | a9a57861-b9a6-460c-bf82-e29383db6363 |
| category_id | string | a5eaf94a-7547-4441-a08c-af9a3e66b653 |
| name | string | 126 - ORATA ALLA GRIGLIA |
| description | string | Orata fresca grigliata con insalata, pomodoro, pat |
| price | integer | 12 |
| image_url | nullable | null... |
| ingredients | json | ["orata","insalata","pomodoro","patatine fritte","... |
| allergens | nullable | null... |
| is_vegetarian | boolean | false |
| is_vegan | boolean | false |
| is_gluten_free | boolean | false |
| is_featured | boolean | false |
| is_active | boolean | true |
| sort_order | integer | 126 |
| preparation_time | integer | 20 |
| calories | nullable | null... |
| slug | string | orata-alla-griglia |
| stock_quantity | integer | 50 |
| compare_price | nullable | null... |
| meta_title | nullable | null... |
| meta_description | nullable | null... |
| labels | nullable | null... |
| created_at | timestamp | 2025-08-25T22:46:51.953587+00:00 |
| updated_at | timestamp | 2025-08-25T22:46:51.953587+00:00 |

### orders
Records: 0

| Column | Type | Sample Value |
|--------|------|--------------|

### order_items
Records: 0

| Column | Type | Sample Value |
|--------|------|--------------|

### comments
Records: 0

| Column | Type | Sample Value |
|--------|------|--------------|

### user_profiles
Records: 0

| Column | Type | Sample Value |
|--------|------|--------------|

### admin_sessions
Records: 0

| Column | Type | Sample Value |
|--------|------|--------------|

### content_sections
Records: 4

| Column | Type | Sample Value |
|--------|------|--------------|
| id | string | cc023c4e-747f-4214-80bd-6a727b69d00e |
| section_key | string | flegrea_section |
| section_name | string | Flegrea Pizza Section |
| title | string | A PROPOSITO DI FLEGREA |
| content | string | Gusta la nostra pizza in stile napoletano dall'ott |
| content_type | string | text |
| content_value | nullable | null... |
| image_url | string | https://images.unsplash.com/photo-1555396273-367ea |
| video_url | nullable | null... |
| metadata | json | {"subtitle":"5 diversi tipi di impasti da provare:... |
| is_active | boolean | true |
| sort_order | integer | 1 |
| created_at | timestamp | 2025-08-26T00:52:53.722189+00:00 |
| updated_at | timestamp | 2025-08-26T00:52:53.722189+00:00 |

### profiles ❌
Error: Could not find the table 'public.profiles' in the schema cache

