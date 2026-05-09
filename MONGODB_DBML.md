# MongoDB DBML

File ini merangkum struktur database backend `laravel02-be` dalam format DBML dengan fokus pada runtime model MongoDB yang benar-benar dipakai aplikasi.

## Basis inferensi
- Model MongoDB: `app/Models/*.php`
- Trait relasi role: `app/Traits/HasRoles.php`
- Migration: `database/migrations/*.php`
- Controller yang menulis data: `PredictionController`, `AdminArticleController`, `AdminUserController`, `AiController`
- Seeder: `RolePermissionSeeder`, `ArticleSeeder`, `PredictionSeeder`

## Catatan penting
- Representasi ini mengikuti **runtime storage MongoDB**, bukan sekadar bentuk migration SQL-style Laravel.
- Migration domain utama sekarang sudah diarahkan ke `Schema::connection('mongodb')`, jadi dokumentasi ini mengikuti runtime model **dan** migration MongoDB yang terbaru.
- Masih ada beberapa relasi yang bersifat logis/denormalized, bukan foreign key tegas.
- `roles` ke `users` disimpan lewat relasi many-to-many custom pada `HasRoles`, sehingga saya tampilkan sebagai relasi logis `user_roles`.
  - `users.read_article` adalah array id artikel yang dibaca user dan **bukan collection terpisah**.
- `articles.category` saat ini disimpan sebagai **string biasa**, bukan `category_id`, jadi **tidak ada foreign key yang benar-benar tegas** ke `categories`.
- `_id` MongoDB direpresentasikan sebagai `id string [pk]` agar kompatibel dengan DBML/dbdiagram.

## Relasi yang jelas
- `users` 1..N `articles` lewat `articles.author_id`
- `users` 1..N `predictions` lewat `predictions.user_id`
- `users` 1..N `chats` lewat `chats.user_id`
- `roles` N..N `permissions` lewat `role_has_permissions`
- `users` N..N `roles` lewat relasi logis `user_roles`
- `users` N..N `articles` tersimpan sebagai array `users.read_article[]`, bukan collection terpisah
- `personal_access_tokens` polymorphic ke `users` lewat `tokenable_type + tokenable_id`

## DBML
```dbml
Project heartcare_mongodb {
  database_type: "MongoDB"
  Note: '''
  Runtime schema inferred from MongoDB Eloquent models plus controller/seeder usage.
  Some relationships are logical/denormalized because the app stores ids inside arrays
  instead of enforcing strict foreign keys like a relational database.
  '''
}

Table users {
  id string [pk, note: "MongoDB ObjectId represented as string"]
  name string
  email string [unique]
  password string
  phone_number string [note: "nullable"]
  profile_picture string [note: "nullable, inferred from model"]
  gender string [note: "nullable, inferred from model"]
  address string [note: "nullable, inferred from model"]
  birth_date string [note: "nullable, inferred from model"]
  read_article json [note: "nullable array of article ids already read by the user"]
  email_verified_at datetime [note: "nullable"]
  remember_token string [note: "nullable"]
  created_at datetime
  updated_at datetime
}

Table articles {
  id string [pk]
  title string
  slug string [unique]
  content text
  raw_content text [note: "nullable"]
  category string [note: "stored as plain string, not category_id"]
  thumbnail string [note: "nullable"]
  author_id string [ref: > users.id]
  status string [note: "draft | published"]
  created_at datetime
  updated_at datetime
}

Table categories {
  id string [pk]
  name string
  slug string [unique]
  created_at datetime
  updated_at datetime
}

Table predictions [note: "Backed by MongoDB model and create_predictions migration; input_data shape inferred from controller/seeder usage"] {
  id string [pk]
  user_id string [ref: > users.id]
  input_data json [note: "embedded health payload: age, gender, systolic_bp, diastolic_bp, cholesterol, heart_rate, weight, height, blood_sugar, smoking, exercise, alcohol, history[]"]
  result_level string [note: "runtime values observed: RENDAH | TINGGI"]
  result_score float
  recommendations json [note: "nullable array"]
  created_at datetime
  updated_at datetime
}

Table chats {
  id string [pk]
  user_id string [ref: > users.id]
  message text
  response text
  created_at datetime
  updated_at datetime
}

Table roles {
  id string [pk]
  name string
  guard_name string
  created_at datetime
  updated_at datetime
}

Table permissions {
  id string [pk]
  name string
  guard_name string
  created_at datetime
  updated_at datetime
}

Table role_has_permissions {
  permission_id string [ref: > permissions.id]
  role_id string [ref: > roles.id]

  indexes {
    (permission_id, role_id) [pk]
  }
}

Table user_roles [note: "Logical many-to-many relation inferred from HasRoles::roles(); physical storage may be array-based in MongoDB relation metadata instead of an explicit collection"] {
  user_id string [ref: > users.id]
  role_id string [ref: > roles.id]

  indexes {
    (user_id, role_id) [pk]
  }
}

Table personal_access_tokens {
  id string [pk]
  tokenable_type string [note: "polymorphic type; runtime currently points to App\\Models\\User"]
  tokenable_id string [ref: > users.id]
  name string
  token string
  abilities json [note: "nullable array/json"]
  last_used_at datetime [note: "nullable"]
  expires_at datetime [note: "nullable"]
  created_at datetime
  updated_at datetime
}

Table password_reset_tokens {
  email string [pk, ref: > users.email]
  token string
  created_at datetime [note: "nullable"]
}
```

## Mapping relasi yang perlu diperhatikan
- `articles.author_id -> users.id`
  Ini relasi paling tegas untuk artikel.
- `predictions.user_id -> users.id`
  Semua prediksi milik satu user.
- `chats.user_id -> users.id`
  Riwayat konsultasi AI juga milik satu user.
- `articles.category`
  Secara bisnis ini menunjuk kategori, tetapi implementasinya saat ini **hanya string**, jadi saya tidak membuat foreign key ke `categories.id`.
- `users.read_article`
  Ini array id artikel di dokumen user. Jadi relasinya ada, tetapi **tidak ada collection `user_read_articles`** di database.
- `users <-> roles`
  Trait `HasRoles` memakai `belongsToMany(Role::class, null, 'user_ids', 'role_ids')`, jadi secara logis itu relasi many-to-many walaupun storage fisiknya tidak sejelas pivot SQL biasa.

## Tidak dimasukkan ke diagram inti
- `jobs`
- `failed_jobs`
- `migrations`

Tabel-tabel itu memang bagian dari infrastruktur Laravel, tetapi tidak menambah relasi domain utama aplikasi HeartCare.
