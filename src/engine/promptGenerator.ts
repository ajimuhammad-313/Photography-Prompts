import {
  GeneratedPrompts,
  PhotographyConfig,
  PromptFormat,
  PromptLanguage,
} from '../types/photography';
import { enhanceDescription } from './enhancer';

const HUMAN_CATEGORIES = new Set(['Male', 'Female', 'Child', 'Couple', 'Family', 'Group']);

const ID_MAP: Record<string, string> = {
  // Styles
  'Natural Photography': 'Fotografi Natural',
  'Realistic Photography': 'Fotografi Realistis',
  'Cinematic Photography': 'Fotografi Sinematik',
  'Documentary Photography': 'Fotografi Dokumenter',
  'Editorial Photography': 'Fotografi Editorial',
  'Street Photography': 'Fotografi Jalanan',
  'Fashion Photography': 'Fotografi Fesyen',
  'Lifestyle Photography': 'Fotografi Gaya Hidup',
  'Fine Art Photography': 'Fotografi Seni Rupa',
  'Analog Film Photography': 'Fotografi Film Analog',
  'Portrait Photography': 'Fotografi Potret',
  'Macro Photography': 'Fotografi Makro',
  'Product Photography': 'Fotografi Produk',
  'Architecture Photography': 'Fotografi Arsitektur',
  'Wedding Photography': 'Fotografi Pernikahan',
  'Travel Photography': 'Fotografi Perjalanan',
  'Food Photography': 'Fotografi Kuliner',
  'Wildlife Photography': 'Fotografi Satwa Liar',
  'Sports Photography': 'Fotografi Olahraga',
  'Commercial Photography': 'Fotografi Komersial',

  // Cameras
  'DSLR Camera': 'Kamera DSLR',
  'Mirrorless Camera': 'Kamera Mirrorless',
  'Medium Format Camera': 'Kamera Medium Format',
  '35mm Film Camera': 'Kamera Film 35mm',
  'Large Format Camera': 'Kamera Large Format',
  'Cinema Camera': 'Kamera Sinema',
  'Smartphone Camera': 'Kamera Ponsel Pintar',

  // Lenses
  '16mm Ultra Wide': 'Lensa 16mm Ultra Lebar',
  '24mm Wide Angle': 'Lensa 24mm Sudut Lebar',
  '35mm Documentary': 'Lensa 35mm Dokumenter',
  '50mm Standard Prime': 'Lensa 50mm Prime Standar',
  '85mm Portrait': 'Lensa 85mm Potret',
  '105mm Macro': 'Lensa 105mm Makro',
  '135mm Telephoto': 'Lensa 135mm Telefoto',
  '200mm Telephoto': 'Lensa 200mm Telefoto',
  '24-70mm Zoom': 'Lensa Zoom 24-70mm',
  '70-200mm Zoom': 'Lensa Zoom 70-200mm',

  // Depth of Field
  'Ultra Shallow Bokeh': 'Bokeh Sangat Dangkal',
  'Shallow Depth of Field': 'Ruang Tajam Dangkal',
  'Balanced Depth of Field': 'Ruang Tajam Seimbang',
  'Deep Focus': 'Fokus Dalam',
  'Edge-to-Edge Sharpness': 'Ketajaman Menyeluruh dari Tepi ke Tepi',

  // Focus Distance
  'Extreme Close-Up (0.15m)': 'Jarak Fokus Ekstrem Dekat (0.15m)',
  'Close Subject (0.8m)': 'Jarak Fokus Dekat (0.8m)',
  'Portrait Distance (1.8m)': 'Jarak Potret (1.8m)',
  'Mid-Range (4m)': 'Jarak Menengah (4m)',
  'Hyperfocal / Infinity': 'Hiperfokal / Tak Terhingga',

  // Sensor Format
  'Full Frame (35mm)': 'Sensor Full Frame (35mm)',
  'Medium Format (44x33mm)': 'Sensor Medium Format (44x33mm)',
  'APS-C Crop': 'Sensor APS-C',
  'Micro Four Thirds': 'Sensor Micro Four Thirds',
  'Large Format (4x5 inch)': 'Format Besar (4x5 inci)',
  'Super 35 Cinema': 'Sensor Super 35 Sinema',
  '1-inch Mobile Sensor': 'Sensor Mobile 1 Inci',

  // Lighting
  'Natural Daylight': 'Cahaya Siang Alami',
  'Golden Hour': 'Golden Hour (Cahaya Senja Keemasan)',
  'Blue Hour': 'Blue Hour (Cahaya Senja Biru)',
  'Window Light': 'Cahaya Jendela Alami',
  'Soft Light': 'Cahaya Lembut',
  'Hard Light': 'Cahaya Keras Berkontras',
  'Open Shade': 'Cahaya Teduh Terbuka',
  'Overcast Light': 'Cahaya Langit Mendung Merata',
  'Backlighting': 'Cahaya dari Belakang (Backlight)',
  'Rim Lighting': 'Pencahayaan Tepi (Rim Light)',
  'Rembrandt Lighting': 'Pencahayaan Rembrandt',
  'Butterfly Lighting': 'Pencahayaan Butterfly',
  'Split Lighting': 'Pencahayaan Terbelah (Split Light)',
  'Low-Key Lighting': 'Pencahayaan Low-Key Gelap Dramatis',
  'High-Key Lighting': 'Pencahayaan High-Key Terang Bersih',
  'Studio Softbox Lighting': 'Pencahayaan Softbox Studio',
  'Practical Lighting': 'Pencahayaan Praktis di Lokasi',
  'Ambient Lighting': 'Cahaya Ambien Ruangan',
  'Silhouette Lighting': 'Pencahayaan Siluet',

  // Camera Angles
  'Eye-Level': 'Sudut Sejajar Mata',
  'Low Angle': 'Sudut Rendah (Low Angle)',
  'High Angle': 'Sudut Tinggi (High Angle)',
  "Bird's-Eye View": 'Sudut Pandang Mata Burung',
  "Worm's-Eye View": 'Sudut Pandang Bawah Ekstrem',
  'Dutch Angle': 'Sudut Miring (Dutch Angle)',
  'Over-the-Shoulder': 'Sudut dari Balik Bahu',
  'POV Shot': 'Sudut Pandang Orang Pertama (POV)',
  'Three-Quarter View': 'Sudut Tiga Perempat',

  // Composition
  'Rule of Thirds': 'Aturan Sepertiga (Rule of Thirds)',
  'Center Composition': 'Komposisi Tengah',
  'Symmetrical Composition': 'Komposisi Simetris',
  'Leading Lines': 'Garis Pemandu (Leading Lines)',
  'Golden Ratio': 'Rasio Emas (Golden Ratio)',
  'Negative Space': 'Ruang Negatif Minimalis',
  'Frame Within a Frame': 'Bingkai di Dalam Bingkai',
  'Diagonal Composition': 'Komposisi Diagonal',
  'Layered Composition': 'Komposisi Berlapis',
  'Foreground Framing': 'Pembingkaian Latar Depan',

  // Subjects
  Male: 'pria',
  Female: 'wanita',
  Child: 'anak kecil',
  Couple: 'pasangan',
  Family: 'keluarga',
  Group: 'sekelompok orang',
  Animal: 'satwa',
  Object: 'objek',
  Product: 'produk',
  Landscape: 'lanskap alam',
  Architecture: 'bangunan arsitektur',

  // Framing
  'Extreme Close-Up': 'Close-Up Ekstrem',
  'Close-Up': 'Close-Up',
  Headshot: 'Foto Wajah (Headshot)',
  'Medium Close-Up': 'Medium Close-Up',
  'Half Body': 'Setengah Badan',
  'Three-Quarter Body': 'Tiga Perempat Badan',
  'Full Body': 'Seluruh Badan',
  'Wide Shot': 'Pengambilan Luas (Wide Shot)',
  'Extreme Wide Shot': 'Pengambilan Sangat Luas',

  // Pose
  'Natural Candid': 'pose alami spontan',
  'Standing Relaxed': 'berdiri santai',
  'Walking Naturally': 'berjalan alami',
  'Sitting Casually': 'duduk santai',
  'Leaning Against Wall': 'bersandar di dinding',
  'Dynamic Movement': 'gerakan dinamis',
  'Elegant Fashion Pose': 'pose fesyen elegan',
  'Looking Away': 'menoleh ke samping',
  'Hands in Pockets': 'tangan di dalam saku',

  // Expressions
  'Genuine Smile': 'senyum tulus alami',
  'Soft Smile': 'senyum lembut',
  'Serious Expression': 'ekspresi serius',
  'Confident Look': 'tatapan percaya diri',
  'Joyful Expression': 'ekspresi penuh sukacita',
  'Thoughtful Expression': 'ekspresi termenung penuh pikiran',
  'Laughing Naturally': 'tertawa lepas alami',
  'Melancholic Expression': 'ekspresi melankolis tenang',
  'Neutral Expression': 'ekspresi wajah netral',

  // Human details
  'Natural Skin Texture': 'tekstur kulit alami',
  'Visible Skin Pores': 'pori-pori kulit terlihat nyata',
  'Realistic Hair Strands': 'helai rambut realistis',
  'Natural Facial Asymmetry': 'asimetri wajah manusia alami',
  'Realistic Body Proportions': 'proporsi tubuh realistis',
  'Authentic Facial Expressions': 'ekspresi wajah autentik',

  // Environments
  'Urban City Street': 'jalanan kota urban',
  Forest: 'hutan alami',
  Mountain: 'pegunungan',
  Beach: 'pantai pesisir',
  Garden: 'taman botani',
  Waterfall: 'air terjun',
  'Minimalist Studio': 'studio minimalis',
  'Cozy Interior': 'interior ruangan yang hangat',
  Bedroom: 'kamar tidur bergaya hangat',
  'Modern Office': 'ruang kantor modern',
  Cafe: 'kafe berkarakter hangat',
  Rooftop: 'atap gedung kota',
  'Night City': 'kota malam hari',

  // Weather
  'Clear Weather': 'cuaca cerah bersih',
  'Cloudy Weather': 'cuaca berawan lembut',
  'Rainy Atmosphere': 'suasana hujan basah',
  'Foggy Environment': 'lingkungan berkabut',
  'Misty Morning': 'pagi berkabut tipis',
  'Snowy Weather': 'cuaca bersalju',
  'Sunset Atmosphere': 'suasana matahari terbenam',
  'Nighttime Environment': 'suasana malam hari',

  // Color grading
  'True-to-Life Natural Colors': 'warna natural sesuai kenyataan',
  'Warm Film Look': 'nuansa film hangat',
  'Cool Cinematic Tone': 'nuansa sinematik sejuk',
  'Kodak Portra Inspired': 'gradasi warna terinspirasi Kodak Portra',
  'Fujifilm Inspired': 'gradasi warna terinspirasi Fujifilm',
  'Vintage Analog Film': 'warna film analog klasik',
  'Matte Color Grading': 'gradasi warna matte lembut',
  'Teal and Orange': 'gradasi warna teal dan oranye',
  'High Contrast': 'kontras tonal tinggi',
  'Desaturated Colors': 'warna terdesaturasi lembut',
  'Black and White': 'monokrom hitam putih',
  'Pastel Colors': 'palet warna pastel lembut',
  'Moody Color Grading': 'gradasi warna moody atmosferik',
  'Cinematic Film Look': 'tampilan film sinematik',

  // Quality
  'Standard Quality': 'kualitas fotografi standar yang tajam',
  'High Resolution': 'resolusi tinggi berdetail tajam',
  'Ultra High Resolution': 'resolusi ultra tinggi yang jernih',
  'Professional Photography Quality': 'kualitas fotografi profesional berkelas editorial',
  'Ultra Detailed Photorealism': 'fotorealisme ultra detail dengan ketajaman penuh',
};

function tr(key: string, language: PromptLanguage): string {
  if (language === 'en') return key;
  return ID_MAP[key] || key;
}

function dedupeList(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const norm = trimmed.toLowerCase();
    if (!seen.has(norm)) {
      seen.add(norm);
      out.push(trimmed);
    }
  }
  return out;
}

export function generateNegativePrompt(
  config: PhotographyConfig,
  language: PromptLanguage
): string {
  const isHuman = HUMAN_CATEGORIES.has(config.subjectCategory);
  const isAnalog =
    config.style === 'Analog Film Photography' ||
    config.cameraType === '35mm Film Camera' ||
    config.colorGrading.includes('Film') ||
    config.colorGrading.includes('Portra');
  const isProductOrArch =
    config.style === 'Product Photography' ||
    config.style === 'Architecture Photography' ||
    config.subjectCategory === 'Product' ||
    config.subjectCategory === 'Architecture';

  if (language === 'id') {
    const clauses = [
      'ilustrasi CGI',
      'render 3D',
      'kartun atau anime',
      'komposisi berantakan',
      'tanda air (watermark)',
      'teks atau logo tidak relevan',
      'artefak kompresi JPEG',
      'oversharpening digital berlebihan',
    ];

    if (isHuman) {
      clauses.push(
        'kulit plastik terlalu halus',
        'wajah airbrush berlebihan',
        'anatomi terdistorsi',
        'jari atau anggota tubuh berlebih',
        'mata tidak simetris tidak wajar'
      );
    }
    if (config.style === 'Macro Photography') {
      clauses.push('lampu kilat keras datar', 'blur akibat goyangan kamera', 'fokus meleset');
    }
    if (isAnalog) {
      clauses.push('HDR digital berlebihan', 'warna neon buatan');
    }
    if (isProductOrArch) {
      clauses.push('garis perspektif bengkok', 'pantulan berantakan', 'latar belakang penuh gangguan');
    }
    if (config.colorGrading === 'Black and White') {
      clauses.push('noda warna acak', 'pewarnaan selektif buatan');
    }

    return dedupeList(clauses).join(', ');
  }

  const clauses = [
    '3D render',
    'CGI illustration',
    'cartoon or anime',
    'plastic artificial look',
    'excessive HDR',
    'oversharpened digital artifacts',
    'watermark',
    'unwanted text or signatures',
  ];

  if (isHuman) {
    clauses.push(
      'airbrushed waxy skin',
      'uncanny facial proportions',
      'extra fingers or distorted limbs',
      'asymmetrical lifeless eyes'
    );
  }
  if (config.style === 'Macro Photography') {
    clauses.push('harsh direct flash', 'motion blur', 'missed focus plane');
  }
  if (isAnalog) {
    clauses.push('over-processed digital clarity', 'synthetic neon saturation');
  }
  if (isProductOrArch) {
    clauses.push('warped straight lines', 'cluttered reflections', 'distracting background mess');
  }
  if (config.colorGrading === 'Black and White') {
    clauses.push('color spill', 'artificial selective color');
  }

  return dedupeList(clauses).join(', ');
}

export function generatePrompts(
  config: PhotographyConfig,
  language: PromptLanguage
): GeneratedPrompts {
  const isHuman = HUMAN_CATEGORIES.has(config.subjectCategory);
  const { subject: enhancedSubject, background: enhancedBackground } = enhanceDescription(
    config.customSubject,
    config.customBackground,
    config,
    language
  );

  const cameraDisplay = config.customCamera.trim()
    ? `${tr(config.cameraType, language)} (${config.customCamera.trim()})`
    : tr(config.cameraType, language);

  const lightingDisplay = config.customLighting.trim()
    ? `${tr(config.lighting, language)}, ${config.customLighting.trim()}`
    : tr(config.lighting, language);

  let naturalLanguage = '';
  let structured = '';

  if (language === 'id') {
    const subjectPart = enhancedSubject
      ? `${tr(config.subjectCategory, 'id')}, ${enhancedSubject}`
      : tr(config.subjectCategory, 'id');

    const poseAndExpr = isHuman
      ? `dengan ${tr(config.pose, 'id')} dan ${tr(config.facialExpression, 'id')}`
      : '';

    const humanDetailsPart =
      isHuman && config.humanDetails.length > 0
        ? `Menampilkan ${config.humanDetails.map((d) => tr(d, 'id')).join(', ')}.`
        : '';

    const envPart = enhancedBackground
      ? `${tr(config.environment, 'id')} (${enhancedBackground})`
      : tr(config.environment, 'id');

    const extraNotes = config.customDetails.trim() ? `Detail tambahan: ${config.customDetails.trim()}.` : '';

    const sentences = [
      `${tr(config.style, 'id')} dengan pembingkaian ${tr(config.portraitFraming, 'id').toLowerCase()} yang menampilkan ${subjectPart}${poseAndExpr ? ` ${poseAndExpr}` : ''}.`,
      `Diambil dari ${tr(config.cameraAngle, 'id').toLowerCase()} menggunakan ${tr(config.composition, 'id').toLowerCase()} di lingkungan ${envPart} pada ${tr(config.weather, 'id').toLowerCase()}.`,
      `Diterangi oleh ${lightingDisplay.toLowerCase()} dengan ${tr(config.colorGrading, 'id').toLowerCase()}.`,
      `Direkam menggunakan ${cameraDisplay} bersensor ${tr(config.sensorFormat, 'id')}, ${tr(config.lens, 'id')} pada panjang fokal ${config.focalLength}, bukaan ${config.aperture}, kecepatan rana ${config.shutterSpeed}, dan ${config.iso}, menghasilkan ${tr(config.depthOfField, 'id').toLowerCase()} pada ${tr(config.focusDistance, 'id').toLowerCase()}.`,
      humanDetailsPart,
      extraNotes,
      `Hasil akhir berstandar ${tr(config.quality, 'id').toLowerCase()}, rasio aspek ${config.aspectRatio}.`,
    ].filter(Boolean);

    naturalLanguage = sentences.join(' ');

    structured = [
      `Gaya Fotografi: ${tr(config.style, 'id')}`,
      `Subjek: ${subjectPart}${poseAndExpr ? ` — ${poseAndExpr}` : ''}`,
      `Pembingkaian: ${tr(config.portraitFraming, 'id')}`,
      isHuman && config.humanDetails.length > 0
        ? `Detail Realistis: ${config.humanDetails.map((d) => tr(d, 'id')).join(', ')}`
        : null,
      `Kamera & Sensor: ${cameraDisplay} | ${tr(config.sensorFormat, 'id')}`,
      `Lensa & Eksposur: ${tr(config.lens, 'id')} (${config.focalLength}) | ${config.aperture} | ${config.shutterSpeed} | ${config.iso}`,
      `Fokus & Ruang Tajam: ${tr(config.depthOfField, 'id')} | ${tr(config.focusDistance, 'id')}`,
      `Pencahayaan: ${lightingDisplay}`,
      `Sudut & Komposisi: ${tr(config.cameraAngle, 'id')} | ${tr(config.composition, 'id')}`,
      `Lingkungan & Cuaca: ${envPart} | ${tr(config.weather, 'id')}`,
      `Gradasi Warna: ${tr(config.colorGrading, 'id')}`,
      config.customDetails.trim() ? `Catatan Tambahan: ${config.customDetails.trim()}` : null,
      `Kualitas & Rasio: ${tr(config.quality, 'id')} | Rasio Aspek ${config.aspectRatio}`,
    ]
      .filter(Boolean)
      .join('\n');
  } else {
    const withArticle = (phrase: string): string => {
      const lower = phrase.trim().toLowerCase();
      const useAn = /^[aeiou]/i.test(lower) && !/^uni|^use|^one/i.test(lower);
      return `${useAn ? 'an' : 'a'} ${lower}`;
    };

    const formatColorGrading = (grading: string): string => {
      return grading
        .replace(/Kodak Portra/g, 'KODAK_PORTRA')
        .replace(/Fujifilm/g, 'FUJIFILM')
        .toLowerCase()
        .replace(/kodak_portra/g, 'Kodak Portra')
        .replace(/fujifilm/g, 'Fujifilm');
    };

    const subjectPart = enhancedSubject
      ? `${config.subjectCategory.toLowerCase()} subject, ${enhancedSubject}`
      : `${config.subjectCategory.toLowerCase()} subject`;

    const poseAndExpr = isHuman
      ? `in ${withArticle(config.pose)} posture with ${withArticle(config.facialExpression)}`
      : '';

    const humanDetailsPart =
      isHuman && config.humanDetails.length > 0
        ? `Natural physical fidelity featuring ${config.humanDetails.map((d) => d.toLowerCase()).join(', ')}.`
        : '';

    const envPart = enhancedBackground
      ? `${withArticle(config.environment)} (${enhancedBackground})`
      : withArticle(config.environment);

    const extraNotes = config.customDetails.trim() ? `Additional direction: ${config.customDetails.trim()}.` : '';

    const sentences = [
      `${config.style}, ${config.portraitFraming.toLowerCase()} framing of ${withArticle(subjectPart)}${poseAndExpr ? ` ${poseAndExpr}` : ''}.`,
      `Captured from ${withArticle(config.cameraAngle)} perspective using ${config.composition.toLowerCase()} inside ${envPart} under ${config.weather.toLowerCase()}.`,
      `Illuminated by ${lightingDisplay.toLowerCase()} with ${formatColorGrading(config.colorGrading)} toning.`,
      `Shot on ${withArticle(cameraDisplay)} with ${withArticle(config.sensorFormat)} sensor and ${config.lens} at ${config.focalLength}, ${config.aperture}, ${config.shutterSpeed}, ${config.iso}, delivering ${config.depthOfField.toLowerCase()} at ${config.focusDistance.toLowerCase()}.`,
      humanDetailsPart,
      extraNotes,
      `${config.quality}, aspect ratio ${config.aspectRatio}.`,
    ].filter(Boolean);

    naturalLanguage = sentences.join(' ');

    structured = [
      `Style: ${config.style}`,
      `Subject: ${subjectPart}${poseAndExpr ? ` — ${poseAndExpr}` : ''}`,
      `Framing: ${config.portraitFraming}`,
      isHuman && config.humanDetails.length > 0
        ? `Realistic Details: ${config.humanDetails.join(', ')}`
        : null,
      `Camera & Sensor: ${cameraDisplay} | ${config.sensorFormat}`,
      `Lens & Exposure: ${config.lens} (${config.focalLength}) | ${config.aperture} | ${config.shutterSpeed} | ${config.iso}`,
      `Depth & Focus: ${config.depthOfField} | ${config.focusDistance}`,
      `Lighting: ${lightingDisplay}`,
      `Angle & Composition: ${config.cameraAngle} | ${config.composition}`,
      `Environment & Weather: ${envPart} | ${config.weather}`,
      `Color Grading: ${config.colorGrading}`,
      config.customDetails.trim() ? `Custom Details: ${config.customDetails.trim()}` : null,
      `Output Quality & Format: ${config.quality} | Aspect Ratio ${config.aspectRatio}`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  const negativePrompt = generateNegativePrompt(config, language);
  const completePrompt =
    language === 'id'
      ? `PROMPT UTAMA:\n${naturalLanguage}\n\nPROMPT TERSTRUKTUR:\n${structured}\n\nPROMPT NEGATIF:\n${negativePrompt}`
      : `MAIN PROMPT:\n${naturalLanguage}\n\nSTRUCTURED PROMPT:\n${structured}\n\nNEGATIVE PROMPT:\n${negativePrompt}`;

  return {
    naturalLanguage,
    structured,
    negativePrompt,
    completePrompt,
    enhancedSubject,
    enhancedBackground,
    language,
    wordCount: naturalLanguage.split(/\s+/).filter(Boolean).length,
  };
}

export function formatPromptAsTxt(
  config: PhotographyConfig,
  prompts: GeneratedPrompts,
  format: PromptFormat
): string {
  const activeMain = format === 'structured' ? prompts.structured : prompts.naturalLanguage;
  return [
    'LENSCRAFT AI — PHOTOGRAPHY PROMPT EXPORT',
    `Language: ${prompts.language === 'id' ? 'Indonesian' : 'English'}`,
    `Style: ${config.style}`,
    `Aspect Ratio: ${config.aspectRatio}`,
    '',
    '--- MAIN PROMPT ---',
    activeMain,
    '',
    '--- STRUCTURED BREAKDOWN ---',
    prompts.structured,
    '',
    '--- NEGATIVE PROMPT ---',
    prompts.negativePrompt,
  ].join('\n');
}

export function formatPromptAsJson(
  config: PhotographyConfig,
  prompts: GeneratedPrompts
): string {
  return JSON.stringify(
    {
      application: 'LensCraft AI',
      exportedAt: new Date().toISOString(),
      language: prompts.language,
      prompts: {
        naturalLanguage: prompts.naturalLanguage,
        structured: prompts.structured,
        negativePrompt: prompts.negativePrompt,
      },
      configuration: config,
    },
    null,
    2
  );
}
