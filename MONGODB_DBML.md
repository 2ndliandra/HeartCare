# MongoDB DBML

File ini merangkum struktur database backend `laravel02-be` dalam format DBML dengan fokus pada runtime model MongoDB yang benar-benar dipakai aplikasi.

## Basis inferensi
- Model MongoDB aktif: `app/Models/*.php`
- Trait relasi role: `app/Traits/HasRoles.php`
- Migration MongoDB aktif: `database/migrations/*.php`
- Controller penulis data utama: `PredictionController`, `AdminArticleController`, `AdminUserController`, `AiController`

## Catatan penting
- Representasi ini mengikuti **runtime storage MongoDB** yang benar-benar dipakai backend.
- Diagram ini disusun dari gabungan **model aktif**, **trait relasi custom**, dan **migration MongoDB** terbaru.
- Beberapa relasi bersifat **logis/denormalized**, bukan foreign key tegas seperti SQL.
- `users.read_article` adalah array id artikel yang dibaca user dan **bukan collection terpisah**.
- `articles` menyimpan **dua representasi kategori**:
  - `category_id` sebagai referensi logis ke `categories.id`
  - `category` sebagai string denormalized untuk compatibility/display
- Relasi `users <-> roles` tidak memakai pivot MongoDB eksplisit; sinkronisasi role disimpan lewat array `users.role_ids[]` dan `roles.user_ids[]`, lalu dipetakan secara logis sebagai `user_roles`.
- Collection `datasets` punya model, tetapi migration-nya sekarang **no-op** dan komentar migration menyatakan collection itu memang tidak dipakai.
- `_id` MongoDB direpresentasikan sebagai `id string [pk]` agar kompatibel dengan DBML/dbdiagram.

## Relasi yang jelas
- `users` 1..N `articles` lewat `articles.author_id`
- `categories` 1..N `articles` lewat `articles.category_id`
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
  Runtime schema inferred from active MongoDB Eloquent models, custom role trait,
  and the latest MongoDB migrations. Some relationships are logical/denormalized
  because the app stores ids in arrays instead of strict SQL-like foreign keys.
  '''
}

Table users {
  id string [pk, note: "MongoDB ObjectId represented as string"]
  name string
  email string [unique]
  password string
  phone_number string [note: "nullable"]
  profile_picture string [note: "nullable"]
  gender string [note: "nullable"]
  address string [note: "nullable"]
  birth_date string [note: "nullable"]
  read_article json [note: "nullable array of article ids already read by the user"]
  role_ids json [note: "nullable array of role ids; runtime storage used by HasRoles trait"]
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
  category_id string [ref: > categories.id, note: "nullable logical reference to categories"]
  category string [note: "denormalized category name kept for compatibility/display"]
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

Table predictions [note: "Backed by MongoDB model and create_predictions migration"] {
  id string [pk]
  user_id string [ref: > users.id]
  input_data json [note: "embedded health payload from prediction request"]
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
  id string [pk, note: "Stored as unsigned big integer in migration, represented as string here for DBML compatibility"]
  name string
  guard_name string
  user_ids json [note: "nullable array of user ids; runtime storage updated by HasRoles trait"]
  created_at datetime
  updated_at datetime
}

Table permissions {
  id string [pk, note: "Stored as unsigned big integer in migration, represented as string here for DBML compatibility"]
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

Table user_roles [note: "Logical many-to-many relation inferred from HasRoles; physical storage lives in users.role_ids[] and roles.user_ids[]"] {
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
- `articles.category_id -> categories.id`
  Ini referensi kategori yang sekarang dipakai untuk assignment artikel baru.
- `predictions.user_id -> users.id`
  Semua prediksi milik satu user.
- `chats.user_id -> users.id`
  Riwayat konsultasi AI juga milik satu user.
- `articles.category`
  Field ini masih dipertahankan sebagai nama kategori terdenormalisasi untuk kompatibilitas response lama dan kebutuhan display di frontend.
- `users.read_article`
  Ini array id artikel di dokumen user. Jadi relasinya ada, tetapi **tidak ada collection `user_read_articles`** di database.
- `users.role_ids` dan `roles.user_ids`
  Inilah storage runtime untuk relasi user-role di MongoDB; tabel `user_roles` di atas hanya representasi logis agar diagram relasinya mudah dibaca.
- `datasets`
  Belum saya masukkan ke diagram inti karena modelnya ada, tetapi migration aktifnya sengaja tidak membuat collection dan menyatakan fitur itu tidak dipakai.

## Tidak dimasukkan ke diagram inti
- `datasets`
- `jobs`
- `failed_jobs`
- `migrations`

Collection/tabel itu tidak menambah relasi domain utama aplikasi HeartCare saat ini.
