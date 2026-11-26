import { PhotographyConfig, PromptLanguage } from '../types/photography';

const STYLE_SUBJECT_MODIFIERS_EN: Record<string, string> = {
  'Natural Photography': 'captured with unforced organic presence and lifelike surface textures',
  'Realistic Photography': 'rendered with crisp physical accuracy and authentic material detail',
  'Cinematic Photography': 'staged with dramatic narrative tension and rich tonal separation',
  'Documentary Photography': 'caught in an unscripted, candid moment with honest environmental context',
  'Editorial Photography': 'styled with deliberate magazine poise and refined textural contrast',
  'Street Photography': 'framed amidst lively urban rhythm and candid street authenticity',
  'Fashion Photography': 'presented with sculpted garment drape and purposeful editorial posture',
  'Lifestyle Photography': 'bathed in warm everyday relatability and relaxed motion',
  'Fine Art Photography': 'composed with poetic tonal restraint and sculptural stillness',
  'Analog Film Photography': 'imprinted with organic silver-halide grain and gentle highlight roll-off',
  'Portrait Photography': 'isolated with flattering optical compression and expressive eye contact',
  'Macro Photography': 'revealing intricate microscopic geometry and delicate surface facets',
  'Product Photography': 'showcased with pristine industrial edges and balanced specular control',
  'Architecture Photography': 'emphasizing crisp structural lines, spatial scale, and geometric balance',
  'Wedding Photography': 'infused with luminous celebratory warmth and tender emotional timing',
  'Travel Photography': 'anchored in authentic sense of place and expansive atmospheric depth',
  'Food Photography': 'plated with appetizing tactile textures and fresh, natural sheen',
  'Wildlife Photography': 'captured in alert natural behavior with sharp feather or fur definition',
  'Sports Photography': 'frozen at peak kinetic momentum with sharp athletic focus',
  'Commercial Photography': 'finished with clean studio polish, accurate color fidelity, and visual clarity',
};

const STYLE_SUBJECT_MODIFIERS_ID: Record<string, string> = {
  'Natural Photography': 'ditangkap dengan kehadiran organik yang alami serta tekstur permukaan yang hidup',
  'Realistic Photography': 'ditampilkan dengan akurasi fisik yang tajam dan detail material yang autentik',
  'Cinematic Photography': 'ditata dengan ketegangan naratif dramatis dan pemisahan tonal yang kaya',
  'Documentary Photography': 'diabadikan dalam momen spontan tanpa rekayasa dengan konteks lingkungan yang jujur',
  'Editorial Photography': 'ditata dengan gaya majalah yang terarah dan kontras tekstur yang halus',
  'Street Photography': 'dibingkai di tengah ritme perkotaan yang hidup dan keaslian jalanan',
  'Fashion Photography': 'ditampilkan dengan jatuhan busana yang tegas dan postur editorial yang terencana',
  'Lifestyle Photography': 'bernuansa kehangatan keseharian dengan gerakan yang santai dan alami',
  'Fine Art Photography': 'dikomposisikan dengan ketenangan tonal puitis dan keheningan visual',
  'Analog Film Photography': 'memiliki butiran film perak-halida organik dan transisi sorotan cahaya yang lembut',
  'Portrait Photography': 'diisolasi dengan kompresi optik yang menawan dan ekspresi mata yang kuat',
  'Macro Photography': 'menyingkap geometri mikroskopis yang rumit dan detail permukaan yang halus',
  'Product Photography': 'ditampilkan dengan tepian desain yang presisi dan kontrol pantulan cahaya yang seimbang',
  'Architecture Photography': 'menonjolkan garis struktural yang tegas, skala ruang, dan keseimbangan geometris',
  'Wedding Photography': 'dipenuhi kehangatan perayaan yang cerah dan ketepatan momen emosional',
  'Travel Photography': 'berakar pada nuansa lokasi yang autentik dan kedalaman atmosfer yang luas',
  'Food Photography': 'ditata dengan tekstur kuliner yang menggugah selera dan kilau alami yang segar',
  'Wildlife Photography': 'tertangkap dalam perilaku alami yang waspada dengan ketajaman bulu yang detail',
  'Sports Photography': 'dibekukan pada puncak momentum gerak dengan fokus atletik yang tajam',
  'Commercial Photography': 'disempurnakan dengan sentuhan studio yang bersih, akurasi warna, dan kejelasan visual',
};

const LIGHTING_TEXTURE_EN: Record<string, string> = {
  'Golden Hour': 'warm honeyed rim highlights skimming across edges',
  'Blue Hour': 'cool twilight ambience balanced against subtle warm practicals',
  'Window Light': 'directional soft-edged shadows tapering smoothly across the frame',
  'Rembrandt Lighting': 'sculpted triangular cheek illumination and moody falloff',
  'Studio Softbox Lighting': 'clean wraparound diffusion with controlled specular gradients',
  'Backlighting': 'luminous halo separation tracing hair and contours',
  'Silhouette Lighting': 'crisp dark contours carved against a bright luminous backdrop',
  'Rainy Atmosphere': 'glistening wet surfaces catching diffused reflections',
};

const LIGHTING_TEXTURE_ID: Record<string, string> = {
  'Golden Hour': 'sorotan cahaya keemasan hangat yang menyapu tepian subjek',
  'Blue Hour': 'suasana senja biru sejuk yang seimbang dengan cahaya lampu hangat',
  'Window Light': 'bayangan terarah bertepi lembut yang memudar halus di dalam bingkai',
  'Rembrandt Lighting': 'pencahayaan segitiga klasik pada pipi dengan gradasi bayangan dramatis',
  'Studio Softbox Lighting': 'difusi cahaya studio yang bersih dengan gradasi pantulan terkontrol',
  'Backlighting': 'lingkar cahaya belakang yang memisahkan kontur rambut dan bahu',
  'Silhouette Lighting': 'siluet gelap yang tegas berlatar cahaya terang di belakangnya',
  'Rainy Atmosphere': 'permukaan basah berkilau yang memantulkan cahaya terbaur',
};

function cleanText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/[.,;]+$/, '');
}

function alreadyContains(haystack: string, needle: string): boolean {
  const tokens = needle.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  if (tokens.length === 0) return false;
  const h = haystack.toLowerCase();
  const hits = tokens.filter((t) => h.includes(t)).length;
  return hits >= Math.ceil(tokens.length * 0.6);
}

export function enhanceDescription(
  rawSubject: string,
  rawBackground: string,
  config: PhotographyConfig,
  language: PromptLanguage
): { subject: string; background: string } {
  const baseSubject = cleanText(rawSubject);
  const baseBackground = cleanText(rawBackground);

  if (!config.useEnhancer) {
    return {
      subject: baseSubject,
      background: baseBackground,
    };
  }

  if (language === 'id') {
    const styleClause = STYLE_SUBJECT_MODIFIERS_ID[config.style] || '';
    const lightClause = LIGHTING_TEXTURE_ID[config.lighting] || '';

    let enhancedSubject = baseSubject;
    if (enhancedSubject && styleClause && !alreadyContains(enhancedSubject, styleClause)) {
      enhancedSubject = `${enhancedSubject}, ${styleClause}`;
    }

    let enhancedBackground = baseBackground;
    if (enhancedBackground && lightClause && !alreadyContains(enhancedBackground, lightClause)) {
      const connector = /\bdengan\b/i.test(enhancedBackground) ? ', diperkaya ' : ' dengan ';
      enhancedBackground = `${enhancedBackground}${connector}${lightClause}`;
    } else if (!enhancedBackground && lightClause) {
      enhancedBackground = lightClause;
    }

    return {
      subject: enhancedSubject,
      background: enhancedBackground,
    };
  }

  const styleClause = STYLE_SUBJECT_MODIFIERS_EN[config.style] || '';
  const lightClause = LIGHTING_TEXTURE_EN[config.lighting] || '';

  let enhancedSubject = baseSubject;
  if (enhancedSubject && styleClause && !alreadyContains(enhancedSubject, styleClause)) {
    enhancedSubject = `${enhancedSubject}, ${styleClause}`;
  }

  let enhancedBackground = baseBackground;
  if (enhancedBackground && lightClause && !alreadyContains(enhancedBackground, lightClause)) {
    const connector = /\bwith\b/i.test(enhancedBackground) ? ', accented by ' : ' with ';
    enhancedBackground = `${enhancedBackground}${connector}${lightClause}`;
  } else if (!enhancedBackground && lightClause) {
    enhancedBackground = lightClause;
  }

  return {
    subject: enhancedSubject,
    background: enhancedBackground,
  };
}
