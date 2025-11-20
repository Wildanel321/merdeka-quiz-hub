# 📚 Website Quiz Pelajaran Interaktif Kurikulum Merdeka Kelas 12

## 🇮🇩 Semangat Merdeka!

Website quiz interaktif untuk siswa kelas 12 dengan 12 mata pelajaran sesuai Kurikulum Merdeka.

---

## ✨ Fitur Utama

### 1. **12 Mata Pelajaran Lengkap**
- ✅ Pendidikan Agama dan Budi Pekerti
- ✅ Pendidikan Pancasila
- ✅ Bahasa Indonesia
- ✅ Matematika (Umum)
- ✅ Matematika Lanjut
- ✅ Bahasa Inggris (Umum)
- ✅ PJOK
- ✅ Fisika
- ✅ Kimia
- ✅ Biologi
- ✅ Sejarah
- ✅ Seni dan Budaya

### 2. **Mode Quiz**
- 🎯 **Mode Latihan**: Tanpa timer, pembahasan muncul langsung setelah menjawab
- ⏱️ **Mode Ujian**: Dengan timer per soal, pembahasan muncul di akhir

### 3. **Pilihan Jumlah Soal**
- 10 soal
- 20 soal
- 50 soal
- 100 soal
- FULL (semua soal tersedia)

### 4. **Timer Fleksibel** (Mode Ujian)
- 15 detik per soal
- 30 detik per soal (default)
- 60 detik per soal

### 5. **Fitur Tambahan**
- 📊 Progress bar real-time
- 🎨 Animasi transisi smooth
- 🏆 Leaderboard global
- 💾 Simpan skor dengan nama
- 📱 Responsive design (Mobile & Desktop)
- 🎯 Pembahasan lengkap untuk setiap soal

---

## 🚀 Cara Menjalankan Project

### Prerequisites
- Node.js versi 18 atau lebih baru
- npm atau bun

### Langkah 1: Clone & Install
```bash
# Clone repository
git clone <YOUR_GIT_URL>

# Masuk ke folder project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
# atau
bun install
```

### Langkah 2: Jalankan Development Server
```bash
npm run dev
# atau
bun run dev
```

Aplikasi akan berjalan di: **http://localhost:8080**

---

## 💾 Database & Backend

Project ini menggunakan **Lovable Cloud** (Supabase) untuk backend:
- ✅ Database PostgreSQL untuk menyimpan soal & leaderboard
- ✅ Real-time leaderboard updates
- ✅ Otomatis terintegrasi, tidak perlu setup eksternal

### Struktur Database

#### Tabel `questions`
```sql
- id: UUID (Primary Key)
- subject: TEXT (Nama mata pelajaran)
- question: TEXT (Pertanyaan)
- type: TEXT (multiple_choice / complex_multiple_choice)
- options: JSONB (Array pilihan jawaban)
- correct_answer: TEXT (Jawaban benar)
- explanation: TEXT (Pembahasan)
- created_at: TIMESTAMP
```

#### Tabel `leaderboard`
```sql
- id: UUID (Primary Key)
- player_name: TEXT (Nama pemain)
- subject: TEXT (Mata pelajaran)
- score: INTEGER (Skor 0-100)
- total_questions: INTEGER (Jumlah soal)
- time_taken: INTEGER (Waktu dalam detik)
- mode: TEXT (practice / exam)
- created_at: TIMESTAMP
```

---

## 📝 Menambah Soal ke Database

### Cara 1: Via Lovable Cloud UI (Recommended)
1. Buka tab **Cloud** di Lovable
2. Pilih **Database**
3. Klik tabel **questions**
4. Klik **Insert Row**
5. Isi data soal sesuai format

### Cara 2: Via Edge Function (Bulk Insert)
Project sudah dilengkapi dengan edge function `seed-questions` yang berisi contoh 25+ soal.

**Untuk menambah lebih banyak soal:**

1. Edit file: `supabase/functions/seed-questions/index.ts`
2. Tambahkan soal baru ke array `questionsData`:

```typescript
{
  subject: "Nama Mata Pelajaran",
  question: "Pertanyaan Anda?",
  type: "multiple_choice", // atau "complex_multiple_choice"
  options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
  correct_answer: "Pilihan yang benar",
  explanation: "Penjelasan mengapa jawaban ini benar..."
}
```

3. Edge function akan otomatis ter-deploy
4. Call edge function via Cloud UI untuk insert soal

### Format Soal yang Benar

#### Pilihan Ganda (multiple_choice)
```json
{
  "subject": "Matematika (Umum)",
  "question": "Berapakah hasil dari 2 + 2?",
  "type": "multiple_choice",
  "options": ["2", "3", "4", "5"],
  "correct_answer": "4",
  "explanation": "2 + 2 = 4 berdasarkan operasi penjumlahan dasar."
}
```

#### Pilihan Ganda Kompleks (complex_multiple_choice)
```json
{
  "subject": "Biologi",
  "question": "Manakah yang termasuk organel sel? (Pilih semua yang benar)",
  "type": "complex_multiple_choice",
  "options": ["Nukleus", "Mitokondria", "Dinding sel", "Kloroplas"],
  "correct_answer": "Nukleus, Mitokondria, Kloroplas",
  "explanation": "Semua kecuali dinding sel (hanya ada di sel tumbuhan) adalah organel sel."
}
```

---

## 🎨 Desain & Tema

### Warna Utama
- **Primary**: Merah Indonesia (#DC143C)
- **Secondary**: Putih (#FFFFFF)
- **Accent**: Kuning/Gold untuk highlight
- **Success**: Hijau untuk jawaban benar
- **Error**: Merah untuk jawaban salah
- **Info**: Biru untuk pembahasan

### Animasi
- Fade in untuk halaman
- Slide transition antar soal
- Bounce effect untuk kartu mata pelajaran
- Smooth hover effects

---

## 📱 Responsive Design

Website sudah dioptimalkan untuk:
- ✅ Desktop (1920px ke atas)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1366px)
- ✅ Mobile (320px - 768px)

---

## 🏆 Leaderboard

### Cara Kerja:
1. Setelah menyelesaikan quiz, masukkan nama Anda
2. Klik **Simpan** untuk submit ke leaderboard
3. Skor akan ditampilkan di tab **Leaderboard**
4. Top 10 pemain ditampilkan berdasarkan:
   - Skor tertinggi
   - Waktu tercepat (jika skor sama)

### Informasi di Leaderboard:
- 🏅 Ranking (1-10)
- 👤 Nama pemain
- 📚 Mata pelajaran
- 💯 Skor (0-100)
- 🎯 Mode (Latihan/Ujian)
- ⏱️ Waktu penyelesaian

---

## 🚢 Deploy ke Production

### Deploy via Lovable (Easiest)
1. Buka project di Lovable
2. Klik **Share** → **Publish**
3. Project akan live di: `https://your-project.lovable.app`

### Custom Domain
1. Buka **Project** → **Settings** → **Domains**
2. Klik **Connect Domain**
3. Ikuti instruksi untuk setup DNS
4. Domain custom akan aktif dalam 24 jam

### Deploy Manual ke Platform Lain

#### Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 🎯 Cara Menggunakan Website

### Untuk Siswa:

1. **Pilih Mata Pelajaran**
   - Klik kartu mata pelajaran yang ingin dipelajari
   - Lihat jumlah soal tersedia

2. **Atur Pengaturan Quiz**
   - Pilih **Mode** (Latihan atau Ujian)
   - Pilih **Jumlah Soal** (10, 20, 50, 100, atau FULL)
   - Jika Mode Ujian: Pilih durasi timer per soal

3. **Kerjakan Quiz**
   - Baca soal dengan teliti
   - Pilih jawaban yang menurut Anda benar
   - Mode Latihan: Pembahasan langsung muncul
   - Mode Ujian: Lanjut ke soal berikutnya

4. **Lihat Hasil**
   - Skor akhir (0-100)
   - Jumlah benar & salah
   - Total waktu pengerjaan
   - Grade (A, B, C, D, E)

5. **Simpan ke Leaderboard**
   - Masukkan nama Anda
   - Klik Simpan
   - Cek posisi Anda di tab Leaderboard!

### Untuk Guru/Admin:

1. **Menambah Soal**
   - Akses Cloud → Database → questions
   - Tambahkan soal baru sesuai format

2. **Monitor Leaderboard**
   - Lihat performa siswa
   - Analisa mata pelajaran yang sering dipilih

3. **Update Soal**
   - Edit soal yang ada
   - Perbaiki pembahasan jika perlu

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- ⚛️ **React 18** - UI Library
- 🎨 **Tailwind CSS** - Styling
- 🎭 **Framer Motion** - Animations
- 🔷 **TypeScript** - Type Safety
- 🧩 **Shadcn/ui** - Component Library

### Backend
- 🗄️ **Supabase (via Lovable Cloud)** - Database & Auth
- 🔄 **PostgreSQL** - Relational Database
- ⚡ **Edge Functions** - Serverless Functions

### Build Tools
- ⚡ **Vite** - Build Tool
- 📦 **npm/bun** - Package Manager

---

## 📊 Target: 300+ Soal

Untuk mencapai target **minimal 300 soal** (25 soal per mata pelajaran × 12 mapel):

### Sudah Tersedia:
- ✅ 25+ soal contoh di edge function
- ✅ Template struktur soal yang benar

### Yang Perlu Dilakukan:
1. Buka `supabase/functions/seed-questions/index.ts`
2. Tambahkan 20+ soal untuk setiap mata pelajaran
3. Deploy edge function
4. Run function untuk insert ke database

### Tips Membuat Soal Berkualitas:
- ✅ Pastikan soal jelas dan tidak ambigu
- ✅ Buat pembahasan yang mudah dipahami
- ✅ Variasikan tingkat kesulitan (mudah, sedang, sulit)
- ✅ Sesuaikan dengan Kurikulum Merdeka
- ✅ Gunakan bahasa yang sesuai untuk kelas 12

---

## 🐛 Troubleshooting

### Soal tidak muncul?
- Pastikan database sudah ter-seed dengan soal
- Cek koneksi Lovable Cloud
- Refresh halaman

### Leaderboard kosong?
- Selesaikan minimal 1 quiz dan simpan nama
- Cek koneksi database

### Timer tidak jalan?
- Pastikan Mode Ujian dipilih
- Refresh halaman jika masih error

### Build error?
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install

# Clear cache
npm run dev --force
```

---

## 📞 Support & Kontribusi

- 📧 Email: support@example.com
- 🌐 Dokumentasi Lovable: https://docs.lovable.dev
- 💬 Community: Lovable Discord

---

## 📜 License

MIT License - Free to use and modify

---

## 🎓 Kesimpulan

Website Quiz Kurikulum Merdeka ini siap digunakan untuk:
- ✅ Latihan soal mandiri
- ✅ Persiapan ujian
- ✅ Evaluasi pemahaman materi
- ✅ Kompetisi antar siswa (via leaderboard)

**Semangat Belajar! Merdeka Belajar! 🇮🇩**

---

*Dibuat dengan ❤️ menggunakan Lovable*
