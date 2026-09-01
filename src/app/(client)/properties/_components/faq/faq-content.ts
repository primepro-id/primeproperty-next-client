export type FaqItem = {
  question: string;
  answer?: string;
  paragraphs?: string[];
  items?: string[];
};

export type FaqSection = {
  title: string;
  items: FaqItem[];
};

export const getFaqAnswerText = (item: FaqItem) =>
  [item.answer, ...(item.paragraphs ?? []), ...(item.items ?? [])]
    .filter(Boolean)
    .join(" ");

export const PRIMEPRO_FAQ_SECTIONS: FaqSection[] = [
  {
    title: "A. Informasi Titip Jual & Sewa di Primepro Indonesia",
    items: [
      {
        question: "Apa saja layanan yang disediakan oleh PrimePro Indonesia ?",
        answer:
          "PrimePro Indonesia membantu pemasaran dalam penjualan dan penyewaan seluruh jenis properti.",
      },
      {
        question:
          "Bagaimana cara menitipkan properti melalui PrimePro Indonesia ?",
        answer:
          "Bapak/Ibu dapat langsung menghubungi kami di nomor WA 0821 1616 2995.",
      },
      {
        question:
          "Apakah kami dapat mendapatkan informasi tentang harga pasaran properti dari agen PrimePro Indonesia?",
        answer:
          "Bapak/Ibu dapat langsung menghubungi kami di nomor WA 0821 1616 2995 untuk diarahkan ke marketing spesialis area tempat properti dipasarkan.",
      },
      {
        question:
          "Apa saja manfaat menitipkan properti ke agen PrimePro Indonesia ?",
        items: [
          "Properti dipasarkan melalui beberapa platform.",
          "Properti memiliki exposure tinggi ke para calon pembeli.",
          "Properti akan dianalisis nilai pasarnya oleh agen PrimePro.",
        ],
      },
      {
        question:
          "Apakah PrimePro Indonesia membantu dalam proses negosiasi harga ?",
        answer:
          "Betul, agen kami akan membantu proses negosiasi sampai mendapatkan harga terbaik yang disepakati para pihak.",
      },
      {
        question:
          "Apakah ada biaya untuk memasarkan properti di PrimePro Indonesia?",
        answer:
          "Kami tidak memungut biaya pemasaran, tetapi ada success fee yang dibayarkan oleh pemilik apabila properti terjual melalui agen kami. Besaran dan ketentuannya perlu dikonfirmasi dalam kesepakatan tertulis.",
      },
    ],
  },
  {
    title: "B. Informasi Beli dan Sewa Properti",
    items: [
      {
        question:
          "Apa saja jenis property yang ditawarkan oleh Primepro Indonesia ?",
        answer:
          "Tanah, rumah tinggal, apartemen, ruko, office space, pabrik, gedung, dan jenis properti lainnya yang tersedia dalam inventaris.",
      },
      {
        question:
          "Bagaimana cara membeli atau menyewa properti di PrimePro Indonesia ?",
        answer:
          "Bapak/Ibu dapat langsung menghubungi kami di nomor WA 0821 1616 2995.",
      },
      {
        question: "Apakah properti yang dipasarkan PrimePro sudah legal?",
        answer:
          "Agen kami meminta dokumen legalitas sebelum memasarkan properti. Pembeli atau penyewa tetap perlu meminta notaris/PPAT memeriksa keaslian, status, dan kelengkapan dokumen kepada instansi berwenang sebelum bertransaksi.",
      },
      {
        question:
          "Apakah PrimePro Indonesia dapat membantu pelanggan mengurus KPR?",
        answer:
          "PrimePro dapat membantu menghubungkan pelanggan dengan mitra bank dan mendampingi proses KPR. Persyaratan, penilaian, biaya, dan persetujuan akhir ditentukan oleh bank.",
      },
    ],
  },
  {
    title: "C. Informasi Tentang PrimePro Indonesia",
    items: [
      {
        question: "Jam berapa kantor PrimePro Indonesia beroperasional?",
        paragraphs: [
          "Senin – Jumat jam 09.00 – 17.30",
          "Sabtu jam 09.00 – 13.30",
        ],
      },
      {
        question: "Bagaimana cara menghubungi PrimePro Indonesia?",
        answer:
          "Bapak/Ibu dapat langsung menghubungi kami di nomor WA 0821 1616 2995.",
      },
      {
        question: "Apakah dapat datang langsung ke kantor PrimePro Indonesia?",
        answer:
          "Lokasi kantor kami di Jl Pakubuwono VI No. 35, Kebayoran Baru, Jakarta Selatan.",
      },
      {
        question:
          "Bagaimana jika saya ingin bergabung menjadi agen property di PrimePro Indonesia?",
        answer:
          "Bapak/Ibu dapat langsung menghubungi kami di nomor WA 0821 1616 2995.",
      },
    ],
  },
];

export const PROPERTY_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Pajak apa saja yang dikenakan saat membeli sebuah rumah?",
    answer:
      "Jenis dan besaran pajak serta biaya transaksi bergantung pada objek, lokasi, nilai transaksi, dan ketentuan yang berlaku. Mintalah perincian tertulis dan konfirmasikan kepada notaris/PPAT atau konsultan pajak sebelum bertransaksi.",
  },
  {
    question:
      "Dokumen apa saja yang dibutuhkan untuk melakukan transaksi jual beli properti?",
    answer:
      "Dokumen yang dibutuhkan berbeda menurut status properti dan para pihak. Notaris/PPAT perlu memeriksa identitas, bukti kepemilikan, data pajak, serta dokumen pendukung lain dan mengonfirmasi kelengkapannya kepada instansi berwenang.",
  },
  {
    question: "Apakah harga properti masih bisa dinegosiasikan?",
    answer:
      "Harga yang tercantum pada iklan umumnya merupakan harga penawaran. Calon pembeli dapat menyampaikan penawaran, lalu pemilik menentukan apakah harga dan syaratnya dapat disepakati.",
  },
  {
    question:
      "Berapa lama proses balik nama sertifikat biasanya memakan waktu?",
    answer:
      "Waktu proses balik nama bervariasi menurut kelengkapan dokumen, jenis transaksi, notaris/PPAT, dan kantor pertanahan setempat. Mintalah estimasi terbaru dari notaris/PPAT yang menangani transaksi.",
  },
  {
    question: "Apakah harga sudah termasuk biaya notaris dan balik nama?",
    answer:
      "Belum tentu. Cakupan harga dan pembagian biaya bergantung pada kesepakatan transaksi. Mintalah rincian tertulis mengenai pajak, biaya notaris/PPAT, balik nama, dan biaya lain sebelum menyetujui transaksi.",
  },
  {
    question:
      "Bagaimana cara memastikan legalitas dan keaslian sertifikat properti?",
    answer:
      "Gunakan notaris/PPAT untuk memeriksa dokumen pemilik dan mengonfirmasi status serta keaslian bukti hak kepada instansi berwenang sebelum pembayaran atau penandatanganan transaksi.",
  },
  {
    question:
      "Apakah pembelian properti dapat dilakukan menggunakan mata uang dolar?",
    answer:
      "Mata uang dan tata cara pembayaran harus mengikuti ketentuan yang berlaku serta kesepakatan transaksi. Konfirmasikan mekanismenya kepada bank dan notaris/PPAT sebelum melakukan pembayaran.",
  },
  {
    question: "Jika membeli dengan sistem KPR, apa saja syarat dan tahapannya?",
    answer:
      "Agen PrimePro dapat membantu menghubungkan pembeli dengan tim bank. Persyaratan dokumen, penilaian agunan, suku bunga, biaya, tahapan, dan keputusan kredit ditentukan oleh bank yang dipilih.",
  },
  {
    question:
      "Apakah bisa melakukan survei langsung ke lokasi sebelum memutuskan membeli atau menyewa?",
    answer:
      "Bisa. Hubungi agen listing untuk mengatur jadwal survei dan mengonfirmasi bahwa properti masih tersedia sebelum datang.",
  },
  {
    question:
      "Untuk sewa, apakah ada uang jaminan (deposit) dan bagaimana ketentuannya?",
    answer:
      "Uang jaminan, nominal, pihak yang memegang dana, syarat pengembalian, dan potongan harus disepakati oleh pemilik dan penyewa serta dicantumkan dalam perjanjian sewa.",
  },
  {
    question: "Berapa lama minimal masa sewa, dan apakah bisa diperpanjang?",
    answer:
      "Masa sewa minimum dan opsi perpanjangan ditentukan oleh pemilik serta kesepakatan sewa. Periksa informasi pada listing dan konfirmasikan ketentuannya kepada agen sebelum menyewa.",
  },
  {
    question:
      "Siapa yang bertanggung jawab atas biaya perawatan atau perbaikan selama masa sewa?",
    answer:
      "Pembagian tanggung jawab pemilik dan penyewa bergantung pada kesepakatan. Jenis perawatan, batas biaya, dan prosedur persetujuan perbaikan sebaiknya dicantumkan secara jelas dalam perjanjian sewa.",
  },
  {
    question:
      "Apakah pembeli akan mendapatkan bantuan dalam proses pengurusan KPR atau dokumen legal?",
    answer:
      "PrimePro dapat membantu menghubungkan pembeli dengan tim bank serta notaris/PPAT. Keputusan kredit berada pada bank, sedangkan pemeriksaan dan pengurusan dokumen dilakukan oleh profesional serta instansi berwenang terkait.",
  },
  {
    question:
      "Bagaimana cara mengetahui estimasi biaya tambahan selain harga jual atau sewa properti?",
    answer:
      "Mintalah rincian tertulis dari agen dan pihak yang menangani transaksi. Konfirmasikan komponen pajak dan biaya legal kepada notaris/PPAT atau konsultan pajak, serta biaya kredit kepada bank.",
  },
  {
    question:
      "Apakah saya akan mendapatkan pendampingan dari agen Prime Pro selama proses pembelian properti?",
    answer:
      "Agen PrimePro dapat mendampingi komunikasi, survei, negosiasi, dan koordinasi proses transaksi. Pemeriksaan legal, keputusan kredit, dan persetujuan akhir tetap dilakukan oleh pihak profesional atau instansi yang berwenang.",
  },
  {
    question:
      "Apakah notaris yang digunakan berasal dari pihak saya sendiri atau ditentukan oleh Prime Pro?",
    answer:
      "PrimePro memiliki rekanan notaris, tetapi pemilihan notaris/PPAT perlu disepakati oleh pemilik dan pembeli. Para pihak dapat membahas pilihan profesional yang independen sebelum transaksi.",
  },
];

export const ALL_FAQ_ITEMS = [
  ...PRIMEPRO_FAQ_SECTIONS.flatMap((section) => section.items),
  ...PROPERTY_FAQ_ITEMS,
];
