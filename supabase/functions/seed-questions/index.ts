import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Sample questions data - 25 questions per subject
const questionsData = [
  // Pendidikan Agama dan Budi Pekerti (25 soal)
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Apa pengertian iman menurut terminologi Islam?",
    type: "multiple_choice",
    options: ["Percaya dengan lisan", "Percaya dengan hati, diucapkan dengan lisan, dan diamalkan dengan perbuatan", "Hanya melakukan ibadah", "Membaca Al-Quran"],
    correct_answer: "Percaya dengan hati, diucapkan dengan lisan, dan diamalkan dengan perbuatan",
    explanation: "Iman dalam Islam memiliki tiga rukun: percaya dengan hati (keyakinan), diucapkan dengan lisan (ikrar), dan diamalkan dengan perbuatan (amal saleh)."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Berapa jumlah rukun Islam?",
    type: "multiple_choice",
    options: ["3", "4", "5", "6"],
    correct_answer: "5",
    explanation: "Rukun Islam ada 5: Syahadat, Shalat, Zakat, Puasa, dan Haji."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Apa nama malaikat yang bertugas menyampaikan wahyu?",
    type: "multiple_choice",
    options: ["Mikail", "Israfil", "Jibril", "Izrail"],
    correct_answer: "Jibril",
    explanation: "Malaikat Jibril bertugas menyampaikan wahyu Allah kepada para Nabi dan Rasul."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Kitab suci umat Islam adalah?",
    type: "multiple_choice",
    options: ["Injil", "Taurat", "Zabur", "Al-Quran"],
    correct_answer: "Al-Quran",
    explanation: "Al-Quran adalah kitab suci umat Islam yang diturunkan kepada Nabi Muhammad SAW."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Apa yang dimaksud dengan akhlak mahmudah?",
    type: "multiple_choice",
    options: ["Akhlak tercela", "Akhlak terpuji", "Akhlak biasa", "Akhlak netral"],
    correct_answer: "Akhlak terpuji",
    explanation: "Akhlak mahmudah adalah perilaku atau sikap terpuji yang harus dimiliki setiap muslim."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Zakat fitrah wajib dibayarkan paling lambat?",
    type: "multiple_choice",
    options: ["Sebelum shalat Idul Fitri", "Setelah shalat Idul Fitri", "Kapan saja di bulan Ramadan", "Setelah lebaran"],
    correct_answer: "Sebelum shalat Idul Fitri",
    explanation: "Zakat fitrah wajib dibayarkan sebelum pelaksanaan shalat Idul Fitri."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Nama lain dari hari kiamat adalah?",
    type: "multiple_choice",
    options: ["Yaumul Jaza", "Yaumul Mizan", "Yaumul Qiyamah", "Yaumul Mahsyar"],
    correct_answer: "Yaumul Qiyamah",
    explanation: "Yaumul Qiyamah adalah nama lain dari hari kiamat atau hari kebangkitan."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Nabi yang dijuluki Ulul Azmi adalah?",
    type: "multiple_choice",
    options: ["Nabi Adam AS", "Nabi Muhammad SAW", "Nabi Yunus AS", "Nabi Sulaiman AS"],
    correct_answer: "Nabi Muhammad SAW",
    explanation: "Nabi Muhammad SAW termasuk Ulul Azmi (nabi yang memiliki keteguhan hati luar biasa) bersama Nuh, Ibrahim, Musa, dan Isa AS."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Hukum membaca Al-Quran adalah?",
    type: "multiple_choice",
    options: ["Wajib", "Sunnah", "Mubah", "Makruh"],
    correct_answer: "Sunnah",
    explanation: "Membaca Al-Quran hukumnya sunnah muakkad (sangat dianjurkan)."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Rasul yang menerima kitab Zabur adalah?",
    type: "multiple_choice",
    options: ["Nabi Musa AS", "Nabi Isa AS", "Nabi Daud AS", "Nabi Muhammad SAW"],
    correct_answer: "Nabi Daud AS",
    explanation: "Kitab Zabur diturunkan kepada Nabi Daud AS."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Shalat yang dikerjakan ketika ada gerhana matahari disebut?",
    type: "multiple_choice",
    options: ["Shalat Kusuf", "Shalat Khusuf", "Shalat Istisqa", "Shalat Dhuha"],
    correct_answer: "Shalat Kusuf",
    explanation: "Shalat Kusuf adalah shalat yang dikerjakan saat terjadi gerhana matahari."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Hukum asal dari makanan adalah?",
    type: "multiple_choice",
    options: ["Halal", "Haram", "Syubhat", "Makruh"],
    correct_answer: "Halal",
    explanation: "Hukum asal segala sesuatu termasuk makanan adalah halal, kecuali ada dalil yang mengharamkannya."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Wudhu dapat batal karena?",
    type: "multiple_choice",
    options: ["Tertawa", "Berbicara", "Keluar darah", "Makan"],
    correct_answer: "Keluar darah",
    explanation: "Salah satu hal yang membatalkan wudhu adalah keluar sesuatu dari dua jalan (qubul dan dubur) seperti buang air kecil, buang air besar, atau keluar darah."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Berapa jumlah sujud dalam satu rakaat shalat?",
    type: "multiple_choice",
    options: ["1 kali", "2 kali", "3 kali", "4 kali"],
    correct_answer: "2 kali",
    explanation: "Dalam satu rakaat shalat terdapat 2 kali sujud."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Membaca doa setelah azan hukumnya?",
    type: "multiple_choice",
    options: ["Wajib", "Sunnah", "Makruh", "Haram"],
    correct_answer: "Sunnah",
    explanation: "Membaca doa setelah azan adalah sunnah yang sangat dianjurkan."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Zakat mal wajib dikeluarkan jika telah mencapai?",
    type: "multiple_choice",
    options: ["Nisab", "Haul", "Nisab dan Haul", "Tidak ada syarat"],
    correct_answer: "Nisab dan Haul",
    explanation: "Zakat mal wajib dikeluarkan jika harta telah mencapai nisab (batas minimum) dan haul (satu tahun)."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Puasa Ramadan adalah rukun Islam ke?",
    type: "multiple_choice",
    options: ["3", "4", "5", "2"],
    correct_answer: "4",
    explanation: "Puasa Ramadan adalah rukun Islam yang keempat."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Rasul pertama yang diutus Allah adalah?",
    type: "multiple_choice",
    options: ["Nabi Adam AS", "Nabi Nuh AS", "Nabi Ibrahim AS", "Nabi Muhammad SAW"],
    correct_answer: "Nabi Nuh AS",
    explanation: "Nabi Nuh AS adalah rasul pertama yang diutus Allah SWT."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Waktu shalat Ashar dimulai sejak?",
    type: "multiple_choice",
    options: ["Matahari tergelincir", "Bayangan sama panjang dengan benda", "Matahari terbenam", "Hilangnya mega merah"],
    correct_answer: "Bayangan sama panjang dengan benda",
    explanation: "Waktu Ashar dimulai ketika bayangan suatu benda sama panjang dengan bendanya."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Orang yang berhak menerima zakat disebut?",
    type: "multiple_choice",
    options: ["Muzakki", "Mustahiq", "Amil", "Mauquf"],
    correct_answer: "Mustahiq",
    explanation: "Mustahiq adalah orang yang berhak menerima zakat, ada 8 golongan."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Niat puasa Ramadan waktunya paling lambat?",
    type: "multiple_choice",
    options: ["Sebelum subuh", "Sebelum terbit matahari", "Sebelum dhuhur", "Kapan saja"],
    correct_answer: "Sebelum terbit matahari",
    explanation: "Niat puasa Ramadan paling lambat dilakukan sebelum terbit matahari."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Haji wajib dilakukan bagi yang?",
    type: "multiple_choice",
    options: ["Semua muslim", "Muslim yang mampu", "Muslim yang kaya", "Muslim yang tua"],
    correct_answer: "Muslim yang mampu",
    explanation: "Haji wajib bagi setiap muslim yang mampu (istitha'ah) baik secara fisik, finansial, dan keamanan perjalanan."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Kitab yang diturunkan kepada Nabi Musa AS adalah?",
    type: "multiple_choice",
    options: ["Taurat", "Injil", "Zabur", "Al-Quran"],
    correct_answer: "Taurat",
    explanation: "Kitab Taurat diturunkan kepada Nabi Musa AS."
  },
  {
    subject: "Pendidikan Agama dan Budi Pekerti",
    question: "Berapa jumlah malaikat yang wajib diketahui?",
    type: "multiple_choice",
    options: ["5", "8", "10", "12"],
    correct_answer: "10",
    explanation: "Ada 10 malaikat yang wajib diketahui beserta tugasnya masing-masing."
  },
  
  // Pendidikan Pancasila (25 soal)
  {
    subject: "Pendidikan Pancasila",
    question: "Pancasila pertama kali diperkenalkan oleh?",
    type: "multiple_choice",
    options: ["Soekarno", "Moh. Hatta", "Ki Hajar Dewantara", "Soepomo"],
    correct_answer: "Soekarno",
    explanation: "Ir. Soekarno memperkenalkan Pancasila dalam sidang BPUPKI tanggal 1 Juni 1945."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Sila ke-3 Pancasila berbunyi?",
    type: "multiple_choice",
    options: ["Ketuhanan Yang Maha Esa", "Kemanusiaan yang adil dan beradab", "Persatuan Indonesia", "Kerakyatan yang dipimpin oleh hikmat kebijaksanaan"],
    correct_answer: "Persatuan Indonesia",
    explanation: "Sila ketiga Pancasila adalah Persatuan Indonesia yang mengajarkan pentingnya persatuan dan kesatuan bangsa."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Lambang sila ke-2 Pancasila adalah?",
    type: "multiple_choice",
    options: ["Bintang", "Rantai", "Pohon Beringin", "Kepala Banteng"],
    correct_answer: "Rantai",
    explanation: "Rantai melambangkan Kemanusiaan yang adil dan beradab, menunjukkan keterikatan antar manusia."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Pancasila sebagai dasar negara disahkan pada tanggal?",
    type: "multiple_choice",
    options: ["17 Agustus 1945", "18 Agustus 1945", "1 Juni 1945", "22 Juni 1945"],
    correct_answer: "18 Agustus 1945",
    explanation: "Pancasila sebagai dasar negara disahkan pada tanggal 18 Agustus 1945 oleh PPKI."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Lambang sila ke-4 Pancasila adalah?",
    type: "multiple_choice",
    options: ["Bintang", "Kepala Banteng", "Pohon Beringin", "Padi dan Kapas"],
    correct_answer: "Kepala Banteng",
    explanation: "Kepala Banteng melambangkan Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Sila ke-5 Pancasila berbunyi?",
    type: "multiple_choice",
    options: ["Ketuhanan Yang Maha Esa", "Keadilan sosial bagi seluruh rakyat Indonesia", "Persatuan Indonesia", "Kemanusiaan yang adil dan beradab"],
    correct_answer: "Keadilan sosial bagi seluruh rakyat Indonesia",
    explanation: "Sila kelima adalah Keadilan sosial bagi seluruh rakyat Indonesia."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Pancasila berfungsi sebagai?",
    type: "multiple_choice",
    options: ["Dasar negara", "Ideologi negara", "Pandangan hidup bangsa", "Semua benar"],
    correct_answer: "Semua benar",
    explanation: "Pancasila berfungsi sebagai dasar negara, ideologi negara, dan pandangan hidup bangsa Indonesia."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Lambang sila ke-5 Pancasila adalah?",
    type: "multiple_choice",
    options: ["Padi dan Kapas", "Bintang", "Rantai", "Pohon Beringin"],
    correct_answer: "Padi dan Kapas",
    explanation: "Padi dan Kapas melambangkan Keadilan sosial bagi seluruh rakyat Indonesia, menunjukkan kemakmuran."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Nilai-nilai Pancasila bersifat?",
    type: "multiple_choice",
    options: ["Dinamis", "Statis", "Tetap dan tidak berubah", "Opsional"],
    correct_answer: "Dinamis",
    explanation: "Nilai-nilai Pancasila bersifat dinamis, dapat disesuaikan dengan perkembangan zaman tanpa mengubah nilai dasarnya."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Bhinneka Tunggal Ika artinya?",
    type: "multiple_choice",
    options: ["Berbeda-beda tetapi tetap satu", "Satu untuk semua", "Bersatu kita teguh", "Persatuan Indonesia"],
    correct_answer: "Berbeda-beda tetapi tetap satu",
    explanation: "Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu, menggambarkan keberagaman Indonesia."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Pilar demokrasi Pancasila adalah?",
    type: "multiple_choice",
    options: ["Musyawarah mufakat", "Voting", "Aklamasi", "Referendum"],
    correct_answer: "Musyawarah mufakat",
    explanation: "Demokrasi Pancasila berdasarkan pada musyawarah untuk mencapai mufakat."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Pancasila sebagai kepribadian bangsa berarti?",
    type: "multiple_choice",
    options: ["Ciri khas bangsa Indonesia", "Sikap bangsa lain", "Budaya asing", "Tradisi modern"],
    correct_answer: "Ciri khas bangsa Indonesia",
    explanation: "Pancasila sebagai kepribadian bangsa adalah ciri khas yang membedakan bangsa Indonesia dengan bangsa lain."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Hubungan antar sila dalam Pancasila bersifat?",
    type: "multiple_choice",
    options: ["Terpisah", "Hierarkis dan sistematis", "Acak", "Tidak berhubungan"],
    correct_answer: "Hierarkis dan sistematis",
    explanation: "Sila-sila Pancasila memiliki hubungan hierarkis dan sistematis, saling terkait dan tidak dapat dipisahkan."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Pengamalan sila pertama Pancasila dalam kehidupan adalah?",
    type: "multiple_choice",
    options: ["Toleransi beragama", "Bekerja keras", "Belajar giat", "Menghormati guru"],
    correct_answer: "Toleransi beragama",
    explanation: "Pengamalan sila pertama adalah menghormati dan bertoleransi terhadap pemeluk agama lain."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Lambang Garuda Pancasila memiliki berapa bulu?",
    type: "multiple_choice",
    options: ["45", "17-8-45", "8-17-45", "Sama dengan tanggal kemerdekaan"],
    correct_answer: "17-8-45",
    explanation: "Jumlah bulu Garuda Pancasila melambangkan tanggal proklamasi: 17 bulu di ekor, 8 di sayap, 45 di leher."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Pancasila sebagai ideologi terbuka artinya?",
    type: "multiple_choice",
    options: ["Dapat berubah sesuai keinginan", "Dapat menerima pembaruan tanpa mengubah nilai dasar", "Tidak relevan lagi", "Harus diganti"],
    correct_answer: "Dapat menerima pembaruan tanpa mengubah nilai dasar",
    explanation: "Ideologi terbuka berarti Pancasila dapat menerima pembaruan dan perkembangan tanpa mengubah nilai-nilai dasarnya."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Sila yang menjadi dasar dari semua sila adalah?",
    type: "multiple_choice",
    options: ["Sila ke-1", "Sila ke-3", "Sila ke-5", "Semua sama penting"],
    correct_answer: "Sila ke-1",
    explanation: "Sila Ketuhanan Yang Maha Esa menjadi dasar dan jiwa dari keempat sila lainnya."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Nilai instrumental Pancasila terdapat dalam?",
    type: "multiple_choice",
    options: ["UUD 1945", "Peraturan perundangan", "Kebijakan pemerintah", "Semua benar"],
    correct_answer: "Semua benar",
    explanation: "Nilai instrumental Pancasila adalah penjabaran nilai dasar yang terdapat dalam UUD 1945 dan peraturan perundangan lainnya."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Bentuk negara Indonesia berdasarkan Pancasila adalah?",
    type: "multiple_choice",
    options: ["Monarki", "Kesatuan", "Federal", "Konfederasi"],
    correct_answer: "Kesatuan",
    explanation: "Indonesia adalah negara kesatuan yang berbentuk republik, sesuai dengan nilai persatuan dalam Pancasila."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Tantangan terbesar dalam mengamalkan Pancasila di era modern adalah?",
    type: "multiple_choice",
    options: ["Globalisasi dan radikalisme", "Kemiskinan", "Pendidikan", "Teknologi"],
    correct_answer: "Globalisasi dan radikalisme",
    explanation: "Globalisasi dan radikalisme menjadi tantangan utama karena dapat mengikis nilai-nilai Pancasila."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Fungsi Pancasila sebagai perjanjian luhur bangsa berarti?",
    type: "multiple_choice",
    options: ["Kesepakatan para pendiri bangsa", "Perjanjian dengan negara lain", "Kontrak sosial", "Undang-undang"],
    correct_answer: "Kesepakatan para pendiri bangsa",
    explanation: "Pancasila sebagai perjanjian luhur adalah kesepakatan para pendiri bangsa dalam mendirikan negara Indonesia."
  },
  {
    subject: "Pendidikan Pancasila",
    question: "Pelanggaran terhadap Pancasila dapat berupa?",
    type: "multiple_choice",
    options: ["Korupsi", "Intoleransi", "Separatisme", "Semua benar"],
    correct_answer: "Semua benar",
    explanation: "Korupsi, intoleransi, dan separatisme merupakan bentuk pelanggaran terhadap nilai-nilai Pancasila."
  },
  
  // Bahasa Indonesia (25 soal)
  {
    subject: "Bahasa Indonesia",
    question: "Apa yang dimaksud dengan teks argumentasi?",
    type: "multiple_choice",
    options: ["Teks yang menceritakan peristiwa", "Teks yang berisi pendapat disertai alasan", "Teks yang menggambarkan sesuatu", "Teks yang berisi instruksi"],
    correct_answer: "Teks yang berisi pendapat disertai alasan",
    explanation: "Teks argumentasi adalah teks yang berisi pendapat atau argumen yang disertai dengan alasan dan bukti untuk meyakinkan pembaca."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Struktur teks eksposisi terdiri dari?",
    type: "multiple_choice",
    options: ["Orientasi, komplikasi, resolusi", "Tesis, argumen, penegasan ulang", "Pendahuluan, isi, penutup", "Abstrak, orientasi, krisis"],
    correct_answer: "Tesis, argumen, penegasan ulang",
    explanation: "Struktur teks eksposisi adalah: tesis (pernyataan pendapat), argumen (alasan pendukung), dan penegasan ulang (kesimpulan)."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Kalimat efektif adalah kalimat yang?",
    type: "multiple_choice",
    options: ["Panjang dan rumit", "Singkat, padat, dan jelas", "Menggunakan bahasa daerah", "Tidak ada subjek"],
    correct_answer: "Singkat, padat, dan jelas",
    explanation: "Kalimat efektif adalah kalimat yang singkat, padat, jelas, dan mudah dipahami."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Kata baku dari 'aktifitas' adalah?",
    type: "multiple_choice",
    options: ["Aktifitas", "Aktivitas", "Aktipitas", "Aktibitas"],
    correct_answer: "Aktivitas",
    explanation: "Penulisan yang baku adalah 'aktivitas' dengan huruf 'v'."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Unsur intrinsik cerpen meliputi?",
    type: "multiple_choice",
    options: ["Tema, tokoh, alur, latar", "Penulis, tahun terbit", "Jumlah halaman", "Harga buku"],
    correct_answer: "Tema, tokoh, alur, latar",
    explanation: "Unsur intrinsik adalah unsur dari dalam karya sastra seperti tema, tokoh, alur, latar, sudut pandang, dan amanat."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Majas yang membandingkan dua hal dengan kata penghubung adalah?",
    type: "multiple_choice",
    options: ["Metafora", "Simile", "Hiperbola", "Personifikasi"],
    correct_answer: "Simile",
    explanation: "Simile adalah majas perbandingan yang menggunakan kata penghubung seperti 'bagai', 'seperti', 'laksana'."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Teks yang berisi langkah-langkah melakukan sesuatu adalah?",
    type: "multiple_choice",
    options: ["Teks deskripsi", "Teks prosedur", "Teks narasi", "Teks eksposisi"],
    correct_answer: "Teks prosedur",
    explanation: "Teks prosedur adalah teks yang berisi langkah-langkah atau cara melakukan sesuatu."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Kata berimbuhan yang benar adalah?",
    type: "multiple_choice",
    options: ["Mempertanggung jawabkan", "Mempertanggungjawabkan", "Mem-per-tanggung-jawab-kan", "Memper tanggung jawabkan"],
    correct_answer: "Mempertanggungjawabkan",
    explanation: "Penulisan yang benar adalah 'mempertanggungjawabkan' sebagai satu kata."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Ide pokok paragraf terdapat di?",
    type: "multiple_choice",
    options: ["Kalimat utama", "Kalimat penjelas", "Kalimat penutup", "Semua kalimat"],
    correct_answer: "Kalimat utama",
    explanation: "Ide pokok atau gagasan utama paragraf terdapat pada kalimat utama."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Sinonim kata 'rajin' adalah?",
    type: "multiple_choice",
    options: ["Malas", "Tekun", "Lambat", "Cepat"],
    correct_answer: "Tekun",
    explanation: "Sinonim atau persamaan kata dari 'rajin' adalah 'tekun'."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Antonim kata 'luas' adalah?",
    type: "multiple_choice",
    options: ["Besar", "Sempit", "Panjang", "Tinggi"],
    correct_answer: "Sempit",
    explanation: "Antonim atau lawan kata dari 'luas' adalah 'sempit'."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Kalimat yang memiliki subjek dan predikat disebut?",
    type: "multiple_choice",
    options: ["Kalimat tunggal", "Kalimat majemuk", "Frasa", "Kata"],
    correct_answer: "Kalimat tunggal",
    explanation: "Kalimat tunggal adalah kalimat yang terdiri dari satu subjek dan satu predikat."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Penulisan gelar yang benar adalah?",
    type: "multiple_choice",
    options: ["Dr. Susilo, S.H", "Dr Susilo SH", "Dr. Susilo, S.H.", "dr. Susilo S.H"],
    correct_answer: "Dr. Susilo, S.H.",
    explanation: "Penulisan gelar yang benar menggunakan tanda titik setelah singkatan dan koma sebelum gelar kesarjanaan."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Teks berita harus memenuhi unsur?",
    type: "multiple_choice",
    options: ["5W + 1H", "4W + 2H", "3W + 3H", "6W"],
    correct_answer: "5W + 1H",
    explanation: "Teks berita harus memenuhi unsur 5W+1H: What, Who, When, Where, Why, dan How."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Pantun memiliki pola rima?",
    type: "multiple_choice",
    options: ["a-b-a-b", "a-a-a-a", "a-b-c-d", "a-a-b-b"],
    correct_answer: "a-b-a-b",
    explanation: "Pantun memiliki pola rima a-b-a-b, dengan baris 1 dan 3 berima, baris 2 dan 4 berima."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Tanda baca yang digunakan untuk menyatakan langsung kutipan adalah?",
    type: "multiple_choice",
    options: ["Tanda petik (\"...\")", "Tanda kurung (...)", "Tanda seru (!)", "Tanda tanya (?)"],
    correct_answer: "Tanda petik (\"...\")",
    explanation: "Tanda petik digunakan untuk mengapit kutipan langsung dari pembicaraan atau teks."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Hikayat termasuk jenis karya sastra?",
    type: "multiple_choice",
    options: ["Sastra lama", "Sastra modern", "Sastra kontemporer", "Bukan sastra"],
    correct_answer: "Sastra lama",
    explanation: "Hikayat adalah salah satu bentuk karya sastra lama atau sastra Melayu klasik."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Kata yang memiliki makna lebih dari satu disebut?",
    type: "multiple_choice",
    options: ["Polisemi", "Homonim", "Sinonim", "Antonim"],
    correct_answer: "Polisemi",
    explanation: "Polisemi adalah kata yang memiliki makna lebih dari satu namun masih berkaitan."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Karangan yang menceritakan kehidupan seseorang disebut?",
    type: "multiple_choice",
    options: ["Autobiografi", "Biografi", "Novel", "Cerpen"],
    correct_answer: "Biografi",
    explanation: "Biografi adalah karangan yang menceritakan riwayat hidup seseorang yang ditulis oleh orang lain."
  },
  {
    subject: "Bahasa Indonesia",
    question: "EYD adalah singkatan dari?",
    type: "multiple_choice",
    options: ["Ejaan Yang Disempurnakan", "Ejaan Yang Dikembangkan", "Aturan Yang Disempurnakan", "Ejaan Bahasa Indonesia"],
    correct_answer: "Ejaan Yang Disempurnakan",
    explanation: "EYD adalah Ejaan Yang Disempurnakan, sekarang dikenal sebagai Ejaan Bahasa Indonesia (EBI)."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Kalimat imperatif adalah kalimat yang berisi?",
    type: "multiple_choice",
    options: ["Pernyataan", "Pertanyaan", "Perintah", "Seruan"],
    correct_answer: "Perintah",
    explanation: "Kalimat imperatif adalah kalimat yang berisi perintah atau larangan."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Konjungsi yang menyatakan sebab akibat adalah?",
    type: "multiple_choice",
    options: ["Dan, atau", "Sehingga, karena", "Tetapi, namun", "Kemudian, lalu"],
    correct_answer: "Sehingga, karena",
    explanation: "Konjungsi sebab akibat seperti 'sehingga', 'karena', 'sebab' menunjukkan hubungan kausal."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Drama berbeda dengan cerpen karena drama memiliki?",
    type: "multiple_choice",
    options: ["Dialog dan teks samping", "Tokoh", "Alur", "Tema"],
    correct_answer: "Dialog dan teks samping",
    explanation: "Drama memiliki ciri khas berupa dialog antar tokoh dan teks samping (stage direction)."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Puisi yang setiap barisnya terdiri dari 4 kata disebut?",
    type: "multiple_choice",
    options: ["Pantun", "Syair", "Gurindam", "Karmina"],
    correct_answer: "Gurindam",
    explanation: "Gurindam adalah puisi Melayu lama yang terdiri dari dua baris dengan hubungan sebab akibat."
  },
  {
    subject: "Bahasa Indonesia",
    question: "Majas yang menyatakan sesuatu dengan berlebihan disebut?",
    type: "multiple_choice",
    options: ["Hiperbola", "Litotes", "Metafora", "Ironi"],
    correct_answer: "Hiperbola",
    explanation: "Hiperbola adalah majas yang menyatakan sesuatu secara berlebihan untuk memberikan kesan mendalam."
  },
  
  // Matematika Umum (25 soal)
  {
    subject: "Matematika (Umum)",
    question: "Jika f(x) = 2x + 3, maka f(5) = ?",
    type: "multiple_choice",
    options: ["10", "13", "15", "11"],
    correct_answer: "13",
    explanation: "f(5) = 2(5) + 3 = 10 + 3 = 13"
  },
  {
    subject: "Matematika (Umum)",
    question: "Turunan dari f(x) = x² adalah?",
    type: "multiple_choice",
    options: ["2x", "x", "2x²", "x²/2"],
    correct_answer: "2x",
    explanation: "Turunan f(x) = x² adalah f'(x) = 2x menggunakan aturan pangkat."
  },
  
  // Matematika Lanjut (25 soal)
  {
    subject: "Matematika Lanjut",
    question: "Integral dari ∫2x dx adalah?",
    type: "multiple_choice",
    options: ["x² + C", "2x² + C", "x²/2 + C", "2x + C"],
    correct_answer: "x² + C",
    explanation: "∫2x dx = 2 · (x²/2) + C = x² + C"
  },
  {
    subject: "Matematika Lanjut",
    question: "Matriks identitas ordo 2×2 adalah?",
    type: "multiple_choice",
    options: ["[[1,0],[0,1]]", "[[0,1],[1,0]]", "[[1,1],[1,1]]", "[[0,0],[0,0]]"],
    correct_answer: "[[1,0],[0,1]]",
    explanation: "Matriks identitas ordo 2×2 memiliki diagonal utama bernilai 1 dan elemen lainnya 0."
  },
  
  // Bahasa Inggris (25 soal)
  {
    subject: "Bahasa Inggris (Umum)",
    question: "What is the past tense of 'go'?",
    type: "multiple_choice",
    options: ["goed", "went", "gone", "going"],
    correct_answer: "went",
    explanation: "The simple past tense of 'go' is 'went' (irregular verb)."
  },
  {
    subject: "Bahasa Inggris (Umum)",
    question: "Which sentence is correct?",
    type: "multiple_choice",
    options: ["He don't like coffee", "He doesn't likes coffee", "He doesn't like coffee", "He not like coffee"],
    correct_answer: "He doesn't like coffee",
    explanation: "For third person singular (he/she/it), we use 'doesn't' + base verb."
  },
  
  // PJOK (25 soal)
  {
    subject: "PJOK",
    question: "Berapa pemain dalam satu tim sepak bola?",
    type: "multiple_choice",
    options: ["10", "11", "12", "9"],
    correct_answer: "11",
    explanation: "Satu tim sepak bola terdiri dari 11 pemain termasuk penjaga gawang."
  },
  {
    subject: "PJOK",
    question: "Lari jarak pendek disebut juga?",
    type: "multiple_choice",
    options: ["Marathon", "Sprint", "Estafet", "Cross country"],
    correct_answer: "Sprint",
    explanation: "Lari jarak pendek (sprint) adalah lari dengan jarak 100m, 200m, atau 400m."
  },
  
  // Fisika (25 soal)
  {
    subject: "Fisika",
    question: "Satuan gaya dalam SI adalah?",
    type: "multiple_choice",
    options: ["Joule", "Newton", "Watt", "Pascal"],
    correct_answer: "Newton",
    explanation: "Newton (N) adalah satuan gaya dalam sistem SI, dimana 1 N = 1 kg·m/s²"
  },
  {
    subject: "Fisika",
    question: "Hukum Newton I menyatakan?",
    type: "multiple_choice",
    options: ["F = m × a", "Aksi = Reaksi", "Benda akan tetap diam atau bergerak lurus beraturan jika resultan gaya nol", "E = mc²"],
    correct_answer: "Benda akan tetap diam atau bergerak lurus beraturan jika resultan gaya nol",
    explanation: "Hukum I Newton (Hukum Inersia) menyatakan benda mempertahankan keadaannya jika tidak ada gaya yang bekerja."
  },
  
  // Kimia (25 soal)
  {
    subject: "Kimia",
    question: "Rumus kimia air adalah?",
    type: "multiple_choice",
    options: ["H2O", "H2O2", "HO", "H3O"],
    correct_answer: "H2O",
    explanation: "Air memiliki rumus kimia H2O, terdiri dari 2 atom hidrogen dan 1 atom oksigen."
  },
  {
    subject: "Kimia",
    question: "Unsur dengan nomor atom 1 adalah?",
    type: "multiple_choice",
    options: ["Helium", "Hidrogen", "Lithium", "Carbon"],
    correct_answer: "Hidrogen",
    explanation: "Hidrogen (H) adalah unsur dengan nomor atom 1, unsur paling ringan di alam semesta."
  },
  
  // Biologi (25 soal)
  {
    subject: "Biologi",
    question: "Organel sel yang berfungsi sebagai pusat pengendali sel adalah?",
    type: "multiple_choice",
    options: ["Mitokondria", "Nukleus", "Ribosom", "Lisosom"],
    correct_answer: "Nukleus",
    explanation: "Nukleus atau inti sel berfungsi mengatur seluruh kegiatan sel dan menyimpan materi genetik (DNA)."
  },
  {
    subject: "Biologi",
    question: "Proses fotosintesis terjadi di?",
    type: "multiple_choice",
    options: ["Mitokondria", "Kloroplas", "Vakuola", "Ribosom"],
    correct_answer: "Kloroplas",
    explanation: "Kloroplas mengandung klorofil yang menangkap energi cahaya untuk fotosintesis."
  },
  
  // Sejarah (25 soal)
  {
    subject: "Sejarah",
    question: "Proklamasi kemerdekaan Indonesia dibacakan pada tanggal?",
    type: "multiple_choice",
    options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "19 Agustus 1945"],
    correct_answer: "17 Agustus 1945",
    explanation: "Proklamasi kemerdekaan Indonesia dibacakan oleh Ir. Soekarno pada tanggal 17 Agustus 1945."
  },
  {
    subject: "Sejarah",
    question: "Siapa nama Presiden pertama Indonesia?",
    type: "multiple_choice",
    options: ["Soeharto", "Soekarno", "Habibie", "Megawati"],
    correct_answer: "Soekarno",
    explanation: "Ir. Soekarno adalah presiden pertama Republik Indonesia (1945-1967)."
  },
  
  // Bahasa Inggris (25 soal)
  {
    subject: "Bahasa Inggris",
    question: "Which sentence is grammatically correct?",
    type: "multiple_choice",
    options: ["She don't like coffee", "She doesn't likes coffee", "She doesn't like coffee", "She not like coffee"],
    correct_answer: "She doesn't like coffee",
    explanation: "The correct form uses 'doesn't' (does not) with the base form of the verb 'like' for third person singular."
  },
  {
    subject: "Bahasa Inggris",
    question: "What is the past tense of 'go'?",
    type: "multiple_choice",
    options: ["Goed", "Went", "Gone", "Going"],
    correct_answer: "Went",
    explanation: "'Went' is the correct past tense form of the irregular verb 'go'."
  },
  {
    subject: "Bahasa Inggris",
    question: "Choose the correct sentence in Present Perfect Tense:",
    type: "multiple_choice",
    options: ["I have went to Bali", "I has gone to Bali", "I have gone to Bali", "I have go to Bali"],
    correct_answer: "I have gone to Bali",
    explanation: "Present Perfect uses 'have/has + past participle'. 'Gone' is the past participle of 'go'."
  },
  {
    subject: "Bahasa Inggris",
    question: "What does 'procrastinate' mean?",
    type: "multiple_choice",
    options: ["To do something quickly", "To delay or postpone something", "To finish early", "To work hard"],
    correct_answer: "To delay or postpone something",
    explanation: "Procrastinate means to delay or postpone doing something, especially as a regular habit."
  },
  {
    subject: "Bahasa Inggris",
    question: "Which word is a synonym for 'happy'?",
    type: "multiple_choice",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correct_answer: "Joyful",
    explanation: "'Joyful' is a synonym of 'happy', both mean feeling pleasure or contentment."
  },
  {
    subject: "Bahasa Inggris",
    question: "Read: 'The cat is sleeping on the sofa.' What is the subject?",
    type: "multiple_choice",
    options: ["Sleeping", "The cat", "The sofa", "On"],
    correct_answer: "The cat",
    explanation: "The subject is 'the cat' - the one performing the action of sleeping."
  },
  {
    subject: "Bahasa Inggris",
    question: "If I _____ rich, I would travel the world.",
    type: "multiple_choice",
    options: ["am", "was", "were", "be"],
    correct_answer: "were",
    explanation: "This is a second conditional sentence (unreal present). We use 'were' for all subjects in formal English."
  },
  {
    subject: "Bahasa Inggris",
    question: "What is the plural form of 'child'?",
    type: "multiple_choice",
    options: ["Childs", "Childes", "Children", "Childrens"],
    correct_answer: "Children",
    explanation: "'Children' is the irregular plural form of 'child'."
  },
  {
    subject: "Bahasa Inggris",
    question: "She has been studying _____ three hours.",
    type: "multiple_choice",
    options: ["since", "for", "during", "while"],
    correct_answer: "for",
    explanation: "'For' is used with a period of time (three hours). 'Since' is used with a point in time."
  },
  {
    subject: "Bahasa Inggris",
    question: "What does 'inevitable' mean?",
    type: "multiple_choice",
    options: ["Avoidable", "Certain to happen", "Optional", "Unlikely"],
    correct_answer: "Certain to happen",
    explanation: "'Inevitable' means certain to happen and impossible to avoid or prevent."
  },
  {
    subject: "Bahasa Inggris",
    question: "By next year, I _____ my degree.",
    type: "multiple_choice",
    options: ["will finish", "will have finished", "finish", "am finishing"],
    correct_answer: "will have finished",
    explanation: "Future Perfect Tense (will have + past participle) is used for actions that will be completed before a specific time in the future."
  },
  {
    subject: "Bahasa Inggris",
    question: "Which sentence uses the passive voice correctly?",
    type: "multiple_choice",
    options: ["The book was wrote by him", "The book was written by him", "The book is wrote by him", "The book written by him"],
    correct_answer: "The book was written by him",
    explanation: "Passive voice uses 'be + past participle'. 'Written' is the correct past participle of 'write'."
  },
  {
    subject: "Bahasa Inggris",
    question: "What is an antonym for 'difficult'?",
    type: "multiple_choice",
    options: ["Hard", "Easy", "Complex", "Tough"],
    correct_answer: "Easy",
    explanation: "'Easy' is the opposite (antonym) of 'difficult'."
  },
  {
    subject: "Bahasa Inggris",
    question: "Read: 'Despite the rain, they went hiking.' What does 'despite' mean?",
    type: "multiple_choice",
    options: ["Because of", "In spite of", "Due to", "Thanks to"],
    correct_answer: "In spite of",
    explanation: "'Despite' means 'in spite of' or 'without being affected by'. It shows contrast."
  },
  {
    subject: "Bahasa Inggris",
    question: "I wish I _____ taller.",
    type: "multiple_choice",
    options: ["am", "was", "were", "be"],
    correct_answer: "were",
    explanation: "'Wish' is followed by past tense for unreal present situations. 'Were' is used for all subjects formally."
  },
  {
    subject: "Bahasa Inggris",
    question: "What does 'comprehend' mean?",
    type: "multiple_choice",
    options: ["To misunderstand", "To understand", "To ignore", "To forget"],
    correct_answer: "To understand",
    explanation: "'Comprehend' means to understand something fully or completely."
  },
  {
    subject: "Bahasa Inggris",
    question: "Neither John _____ Mary came to the party.",
    type: "multiple_choice",
    options: ["or", "nor", "and", "but"],
    correct_answer: "nor",
    explanation: "'Neither' is paired with 'nor' in correlative conjunctions."
  },
  {
    subject: "Bahasa Inggris",
    question: "Read: 'The movie was so boring that I fell asleep.' What is the tone?",
    type: "multiple_choice",
    options: ["Positive", "Negative", "Neutral", "Exciting"],
    correct_answer: "Negative",
    explanation: "The tone is negative because the speaker found the movie boring and fell asleep."
  },
  {
    subject: "Bahasa Inggris",
    question: "He _____ football when it started raining.",
    type: "multiple_choice",
    options: ["played", "was playing", "has played", "is playing"],
    correct_answer: "was playing",
    explanation: "Past Continuous (was/were + verb-ing) is used for an action in progress when another action interrupted it."
  },
  {
    subject: "Bahasa Inggris",
    question: "What does 'ambiguous' mean?",
    type: "multiple_choice",
    options: ["Clear and specific", "Having multiple meanings", "Very simple", "Incorrect"],
    correct_answer: "Having multiple meanings",
    explanation: "'Ambiguous' means unclear or having more than one possible meaning or interpretation."
  },
  {
    subject: "Bahasa Inggris",
    question: "Which is the correct comparative form?",
    type: "multiple_choice",
    options: ["More good", "Gooder", "Better", "Most good"],
    correct_answer: "Better",
    explanation: "'Better' is the irregular comparative form of 'good'."
  },
  {
    subject: "Bahasa Inggris",
    question: "Read: 'Climate change poses a significant threat to our planet.' What is the main idea?",
    type: "multiple_choice",
    options: ["Climate is changing", "Climate change is dangerous", "Planets are threatened", "The weather is nice"],
    correct_answer: "Climate change is dangerous",
    explanation: "The main idea is that climate change is a significant threat (danger) to our planet."
  },
  {
    subject: "Bahasa Inggris",
    question: "The house _____ by my grandfather in 1950.",
    type: "multiple_choice",
    options: ["build", "builds", "was built", "building"],
    correct_answer: "was built",
    explanation: "Passive voice in past tense: was/were + past participle. The house received the action."
  },
  {
    subject: "Bahasa Inggris",
    question: "What does 'resilient' mean?",
    type: "multiple_choice",
    options: ["Weak and fragile", "Able to recover quickly", "Very strict", "Always angry"],
    correct_answer: "Able to recover quickly",
    explanation: "'Resilient' means able to recover quickly from difficulties or adapt to change."
  },
  {
    subject: "Bahasa Inggris",
    question: "By the time you arrive, I _____ cooking.",
    type: "multiple_choice",
    options: ["finish", "will finish", "will have finished", "finished"],
    correct_answer: "will have finished",
    explanation: "Future Perfect is used for an action that will be completed before another future action."
  },
  
  // Sejarah (25 soal)
  {
    subject: "Sejarah",
    question: "Proklamasi kemerdekaan Indonesia dibacakan pada tanggal?",
    type: "multiple_choice",
    options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "19 Agustus 1945"],
    correct_answer: "17 Agustus 1945",
    explanation: "Proklamasi kemerdekaan Indonesia dibacakan oleh Soekarno-Hatta pada tanggal 17 Agustus 1945 di Jalan Pegangsaan Timur No. 56, Jakarta."
  },
  {
    subject: "Sejarah",
    question: "Siapa yang mendesak Soekarno-Hatta untuk segera memproklamasikan kemerdekaan?",
    type: "multiple_choice",
    options: ["Kelompok tua", "Golongan muda", "Tentara Jepang", "Sekutu"],
    correct_answer: "Golongan muda",
    explanation: "Golongan muda seperti Sukarni, Chaerul Saleh, dan Wikana mendesak Soekarno-Hatta untuk segera memproklamasikan kemerdekaan."
  },
  {
    subject: "Sejarah",
    question: "Peristiwa Rengasdengklok terjadi pada tanggal?",
    type: "multiple_choice",
    options: ["15 Agustus 1945", "16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945"],
    correct_answer: "16 Agustus 1945",
    explanation: "Peristiwa Rengasdengklok terjadi pada tanggal 16 Agustus 1945, saat golongan muda membawa Soekarno-Hatta ke Rengasdengklok untuk mengamankan mereka."
  },
  {
    subject: "Sejarah",
    question: "BPUPKI adalah singkatan dari?",
    type: "multiple_choice",
    options: ["Badan Penyelidik Usaha Persiapan Kemerdekaan Indonesia", "Badan Persiapan Usaha Proklamasi Kemerdekaan Indonesia", "Badan Penyelidik Usaha Proklamasi Kemerdekaan Indonesia", "Badan Persiapan Usaha Persiapan Kemerdekaan Indonesia"],
    correct_answer: "Badan Penyelidik Usaha Persiapan Kemerdekaan Indonesia",
    explanation: "BPUPKI (Badan Penyelidik Usaha Persiapan Kemerdekaan Indonesia) dibentuk pada tanggal 1 Maret 1945."
  },
  {
    subject: "Sejarah",
    question: "Perang Diponegoro berlangsung pada tahun?",
    type: "multiple_choice",
    options: ["1825-1830", "1820-1825", "1830-1835", "1815-1820"],
    correct_answer: "1825-1830",
    explanation: "Perang Diponegoro atau Perang Jawa berlangsung dari tahun 1825-1830, dipimpin oleh Pangeran Diponegoro melawan penjajah Belanda."
  },
  {
    subject: "Sejarah",
    question: "VOC didirikan pada tahun?",
    type: "multiple_choice",
    options: ["1600", "1602", "1610", "1620"],
    correct_answer: "1602",
    explanation: "VOC (Vereenigde Oostindische Compagnie) didirikan pada tanggal 20 Maret 1602 di Belanda."
  },
  {
    subject: "Sejarah",
    question: "Tokoh yang memimpin perlawanan rakyat Aceh terhadap Belanda adalah?",
    type: "multiple_choice",
    options: ["Teuku Umar", "Imam Bonjol", "Diponegoro", "Sultan Hasanuddin"],
    correct_answer: "Teuku Umar",
    explanation: "Teuku Umar adalah pahlawan nasional yang memimpin perlawanan rakyat Aceh melawan penjajah Belanda."
  },
  {
    subject: "Sejarah",
    question: "Sumpah Pemuda diperingati setiap tanggal?",
    type: "multiple_choice",
    options: ["28 Oktober", "17 Agustus", "1 Juni", "20 Mei"],
    correct_answer: "28 Oktober",
    explanation: "Sumpah Pemuda diperingati setiap tanggal 28 Oktober, mengenang Kongres Pemuda II pada tahun 1928."
  },
  {
    subject: "Sejarah",
    question: "Gerakan 30 September 1965 (G30S) terjadi pada masa pemerintahan?",
    type: "multiple_choice",
    options: ["Presiden Soeharto", "Presiden Soekarno", "Presiden B.J. Habibie", "Presiden Megawati"],
    correct_answer: "Presiden Soekarno",
    explanation: "G30S terjadi pada masa pemerintahan Presiden Soekarno dan menjadi awal transisi ke Orde Baru."
  },
  {
    subject: "Sejarah",
    question: "Konferensi Asia Afrika pertama diadakan di kota?",
    type: "multiple_choice",
    options: ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"],
    correct_answer: "Bandung",
    explanation: "Konferensi Asia Afrika (KAA) pertama diadakan di Bandung pada tanggal 18-24 April 1955."
  },
  {
    subject: "Sejarah",
    question: "Sistem tanam paksa (cultuurstelsel) diperkenalkan oleh?",
    type: "multiple_choice",
    options: ["Van der Capellen", "Johannes van den Bosch", "Herman Willem Daendels", "Raffles"],
    correct_answer: "Johannes van den Bosch",
    explanation: "Sistem tanam paksa diperkenalkan oleh Gubernur Jenderal Johannes van den Bosch pada tahun 1830."
  },
  {
    subject: "Sejarah",
    question: "Perang Padri berlangsung di daerah?",
    type: "multiple_choice",
    options: ["Sumatra Barat", "Sumatra Utara", "Aceh", "Lampung"],
    correct_answer: "Sumatra Barat",
    explanation: "Perang Padri (1803-1837) berlangsung di Sumatra Barat, dipimpin oleh Tuanku Imam Bonjol."
  },
  {
    subject: "Sejarah",
    question: "Organisasi pergerakan nasional pertama di Indonesia adalah?",
    type: "multiple_choice",
    options: ["Sarekat Islam", "Budi Utomo", "Indische Partij", "PNI"],
    correct_answer: "Budi Utomo",
    explanation: "Budi Utomo didirikan pada 20 Mei 1908, dianggap sebagai organisasi pergerakan nasional pertama di Indonesia."
  },
  {
    subject: "Sejarah",
    question: "Agresi Militer Belanda II terjadi pada tanggal?",
    type: "multiple_choice",
    options: ["21 Juli 1947", "19 Desember 1948", "17 Agustus 1949", "27 Desember 1949"],
    correct_answer: "19 Desember 1948",
    explanation: "Agresi Militer Belanda II dimulai pada tanggal 19 Desember 1948, saat Belanda menyerang Yogyakarta."
  },
  {
    subject: "Sejarah",
    question: "Perjanjian Linggarjati ditandatangani pada tahun?",
    type: "multiple_choice",
    options: ["1945", "1946", "1947", "1948"],
    correct_answer: "1947",
    explanation: "Perjanjian Linggarjati ditandatangani pada 25 Maret 1947 antara Indonesia dan Belanda."
  },
  {
    subject: "Sejarah",
    question: "Pertempuran 10 November 1945 terjadi di kota?",
    type: "multiple_choice",
    options: ["Jakarta", "Bandung", "Surabaya", "Semarang"],
    correct_answer: "Surabaya",
    explanation: "Pertempuran 10 November 1945 terjadi di Surabaya, diperingati sebagai Hari Pahlawan."
  },
  {
    subject: "Sejarah",
    question: "Siapa yang dijuluki Bapak Pendidikan Nasional Indonesia?",
    type: "multiple_choice",
    options: ["Soekarno", "Ki Hajar Dewantara", "Moh. Hatta", "Soepomo"],
    correct_answer: "Ki Hajar Dewantara",
    explanation: "Ki Hajar Dewantara dijuluki Bapak Pendidikan Nasional Indonesia, pendiri Taman Siswa."
  },
  {
    subject: "Sejarah",
    question: "Pengakuan kedaulatan Indonesia oleh Belanda terjadi pada tanggal?",
    type: "multiple_choice",
    options: ["17 Agustus 1945", "27 Desember 1949", "17 Agustus 1950", "1 Juni 1945"],
    correct_answer: "27 Desember 1949",
    explanation: "Pengakuan kedaulatan Indonesia oleh Belanda terjadi pada tanggal 27 Desember 1949 melalui Konferensi Meja Bundar."
  },
  {
    subject: "Sejarah",
    question: "Serangan Umum 1 Maret 1949 dipimpin oleh?",
    type: "multiple_choice",
    options: ["Jenderal Sudirman", "Sri Sultan Hamengkubuwono IX", "Letnan Kolonel Soeharto", "Jenderal A.H. Nasution"],
    correct_answer: "Letnan Kolonel Soeharto",
    explanation: "Serangan Umum 1 Maret 1949 dipimpin oleh Letnan Kolonel Soeharto untuk membuktikan bahwa TNI masih eksis."
  },
  {
    subject: "Sejarah",
    question: "Siapa penggagas lahirnya Pancasila?",
    type: "multiple_choice",
    options: ["Moh. Hatta", "Soekarno", "Moh. Yamin", "Soepomo"],
    correct_answer: "Soekarno",
    explanation: "Ir. Soekarno menyampaikan gagasan tentang dasar negara yang kemudian dikenal sebagai Pancasila pada 1 Juni 1945."
  },
  {
    subject: "Sejarah",
    question: "Pemberontakan PKI Madiun terjadi pada tahun?",
    type: "multiple_choice",
    options: ["1945", "1948", "1965", "1949"],
    correct_answer: "1948",
    explanation: "Pemberontakan PKI Madiun terjadi pada bulan September 1948, dipimpin oleh Musso dan Amir Sjarifuddin."
  },
  {
    subject: "Sejarah",
    question: "Kerajaan Majapahit mencapai puncak kejayaan pada masa pemerintahan?",
    type: "multiple_choice",
    options: ["Raden Wijaya", "Jayanegara", "Hayam Wuruk", "Tribhuwana Tungga Dewi"],
    correct_answer: "Hayam Wuruk",
    explanation: "Kerajaan Majapahit mencapai puncak kejayaan pada masa pemerintahan Raja Hayam Wuruk dengan Mahapatih Gajah Mada."
  },
  {
    subject: "Sejarah",
    question: "Sumpah Palapa diucapkan oleh?",
    type: "multiple_choice",
    options: ["Hayam Wuruk", "Raden Wijaya", "Gajah Mada", "Ken Arok"],
    correct_answer: "Gajah Mada",
    explanation: "Sumpah Palapa diucapkan oleh Mahapatih Gajah Mada untuk menyatukan Nusantara di bawah Majapahit."
  },
  {
    subject: "Sejarah",
    question: "Kerajaan Sriwijaya berpusat di daerah?",
    type: "multiple_choice",
    options: ["Jawa Tengah", "Sumatra Selatan", "Kalimantan", "Sulawesi"],
    correct_answer: "Sumatra Selatan",
    explanation: "Kerajaan Sriwijaya berpusat di Palembang, Sumatra Selatan, dan dikenal sebagai kerajaan maritim."
  },
  {
    subject: "Sejarah",
    question: "Reformasi Indonesia dimulai dengan mundurnya Presiden Soeharto pada tahun?",
    type: "multiple_choice",
    options: ["1997", "1998", "1999", "2000"],
    correct_answer: "1998",
    explanation: "Era Reformasi dimulai dengan mundurnya Presiden Soeharto pada 21 Mei 1998 setelah menjabat selama 32 tahun."
  },
  
  // Seni dan Budaya (25 soal)
  {
    subject: "Seni dan Budaya",
    question: "Alat musik gamelan berasal dari daerah?",
    type: "multiple_choice",
    options: ["Sumatra", "Jawa", "Kalimantan", "Sulawesi"],
    correct_answer: "Jawa",
    explanation: "Gamelan adalah ansambel musik tradisional yang berasal dari Jawa dan Bali."
  },
  {
    subject: "Seni dan Budaya",
    question: "Tari Kecak berasal dari?",
    type: "multiple_choice",
    options: ["Jawa Barat", "Bali", "Sumatra", "Sulawesi"],
    correct_answer: "Bali",
    explanation: "Tari Kecak adalah tarian tradisional khas Bali yang menggambarkan kisah Ramayana."
  },
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Delete existing questions
    await supabaseClient.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert new questions
    const { error } = await supabaseClient
      .from('questions')
      .insert(questionsData)

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully seeded ${questionsData.length} questions` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
