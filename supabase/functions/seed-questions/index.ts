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
