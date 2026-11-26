import {
  ASPECT_RATIO_OPTIONS,
  COLOR_GRADING_OPTIONS,
  COMPOSITION_OPTIONS,
  FACIAL_EXPRESSION_OPTIONS,
  HUMAN_DETAIL_OPTIONS,
  PHOTOGRAPHY_STYLES,
  POSE_OPTIONS,
  QUALITY_OPTIONS,
} from '../data/catalog';
import { PhotographyConfig } from '../types/photography';

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

interface StyleProfile {
  cameras: string[];
  lenses: { lens: string; focal: string }[];
  apertures: string[];
  shutterSpeeds: string[];
  isos: string[];
  dof: string;
  focusDistance: string;
  sensors: string[];
  lightings: string[];
  angles: string[];
  subjects: { category: string; desc: string; framing: string; human: boolean }[];
  environments: string[];
  weathers: string[];
  colorGradings: string[];
  aspectRatios: string[];
}

const STYLE_PROFILES: Record<string, StyleProfile> = {
  'Portrait Photography': {
    cameras: ['Mirrorless Camera', 'Medium Format Camera', 'DSLR Camera'],
    lenses: [
      { lens: '85mm Portrait', focal: '85mm' },
      { lens: '50mm Standard Prime', focal: '50mm' },
      { lens: '135mm Telephoto', focal: '135mm' },
    ],
    apertures: ['f/1.4', 'f/1.8', 'f/2', 'f/2.8'],
    shutterSpeeds: ['1/250s', '1/500s', '1/1000s'],
    isos: ['ISO 100', 'ISO 200', 'ISO 400'],
    dof: 'Shallow Depth of Field',
    focusDistance: 'Portrait Distance (1.8m)',
    sensors: ['Full Frame (35mm)', 'Medium Format (44x33mm)'],
    lightings: ['Window Light', 'Golden Hour', 'Rembrandt Lighting', 'Open Shade', 'Soft Light'],
    angles: ['Eye-Level', 'Three-Quarter View'],
    subjects: [
      { category: 'Female', desc: 'botanical illustrator wearing an earth-toned linen shirt', framing: 'Medium Close-Up', human: true },
      { category: 'Male', desc: 'watchmaker in a tailored wool waistcoat with subtle spectacles', framing: 'Headshot', human: true },
      { category: 'Couple', desc: 'two lifelong friends sharing a quiet conversation over tea', framing: 'Half Body', human: true },
    ],
    environments: ['Cozy Interior', 'Cafe', 'Garden', 'Minimalist Studio'],
    weathers: ['Clear Weather', 'Sunset Atmosphere', 'Cloudy Weather'],
    colorGradings: ['Kodak Portra Inspired', 'True-to-Life Natural Colors', 'Warm Film Look', 'Fujifilm Inspired'],
    aspectRatios: ['4:5', '3:4', '2:3'],
  },
  'Street Photography': {
    cameras: ['35mm Film Camera', 'Mirrorless Camera'],
    lenses: [
      { lens: '35mm Documentary', focal: '35mm' },
      { lens: '50mm Standard Prime', focal: '50mm' },
    ],
    apertures: ['f/2.8', 'f/4', 'f/5.6'],
    shutterSpeeds: ['1/250s', '1/500s'],
    isos: ['ISO 400', 'ISO 800', 'ISO 1600'],
    dof: 'Balanced Depth of Field',
    focusDistance: 'Mid-Range (4m)',
    sensors: ['Full Frame (35mm)', 'APS-C Crop'],
    lightings: ['Blue Hour', 'Practical Lighting', 'Hard Light', 'Overcast Light'],
    angles: ['Eye-Level', 'Low Angle', 'POV Shot'],
    subjects: [
      { category: 'Male', desc: 'cyclist pausing at a crosswalk in a waxed canvas jacket', framing: 'Full Body', human: true },
      { category: 'Female', desc: 'commuter carrying fresh flowers past a sunlit corner kiosk', framing: 'Three-Quarter Body', human: true },
    ],
    environments: ['Urban City Street', 'Night City', 'Cafe'],
    weathers: ['Rainy Atmosphere', 'Clear Weather', 'Nighttime Environment'],
    colorGradings: ['Cinematic Film Look', 'Black and White', 'Cool Cinematic Tone', 'Teal and Orange'],
    aspectRatios: ['3:2', '16:9', '4:5'],
  },
  'Macro Photography': {
    cameras: ['Mirrorless Camera', 'DSLR Camera'],
    lenses: [{ lens: '105mm Macro', focal: '105mm' }],
    apertures: ['f/4', 'f/5.6', 'f/8'],
    shutterSpeeds: ['1/250s', '1/500s'],
    isos: ['ISO 100', 'ISO 200'],
    dof: 'Shallow Depth of Field',
    focusDistance: 'Extreme Close-Up (0.15m)',
    sensors: ['Full Frame (35mm)', 'APS-C Crop'],
    lightings: ['Rim Lighting', 'Soft Light', 'Natural Daylight'],
    angles: ['Eye-Level', 'Three-Quarter View'],
    subjects: [
      { category: 'Object', desc: 'morning condensation spheres resting on moss and cedar bark', framing: 'Extreme Close-Up', human: false },
      { category: 'Animal', desc: 'iridescent damselfly perched delicately on a wild reed tip', framing: 'Extreme Close-Up', human: false },
    ],
    environments: ['Forest', 'Garden'],
    weathers: ['Misty Morning', 'Clear Weather'],
    colorGradings: ['True-to-Life Natural Colors', 'Fujifilm Inspired'],
    aspectRatios: ['4:3', '1:1', '3:2'],
  },
  'Product Photography': {
    cameras: ['Medium Format Camera', 'Mirrorless Camera'],
    lenses: [
      { lens: '105mm Macro', focal: '105mm' },
      { lens: '85mm Portrait', focal: '85mm' },
    ],
    apertures: ['f/8', 'f/11'],
    shutterSpeeds: ['1/125s', '1/250s'],
    isos: ['ISO 50', 'ISO 100'],
    dof: 'Edge-to-Edge Sharpness',
    focusDistance: 'Close Subject (0.8m)',
    sensors: ['Medium Format (44x33mm)', 'Full Frame (35mm)'],
    lightings: ['Studio Softbox Lighting', 'Window Light', 'Rim Lighting'],
    angles: ['Three-Quarter View', 'High Angle', "Bird's-Eye View"],
    subjects: [
      { category: 'Product', desc: 'matte ceramic pour-over coffee dripper beside a fluted glass carafe', framing: 'Close-Up', human: false },
      { category: 'Product', desc: 'brushed titanium mechanical chronograph watch on dark basalt', framing: 'Extreme Close-Up', human: false },
    ],
    environments: ['Minimalist Studio', 'Modern Office'],
    weathers: ['Clear Weather'],
    colorGradings: ['True-to-Life Natural Colors', 'Matte Color Grading', 'High Contrast'],
    aspectRatios: ['4:3', '1:1', '4:5'],
  },
  'Travel Photography': {
    cameras: ['Mirrorless Camera', 'Medium Format Camera', 'DSLR Camera'],
    lenses: [
      { lens: '24mm Wide Angle', focal: '24mm' },
      { lens: '24-70mm Zoom', focal: '35mm' },
      { lens: '16mm Ultra Wide', focal: '16mm' },
    ],
    apertures: ['f/8', 'f/11'],
    shutterSpeeds: ['1/125s', '1/250s'],
    isos: ['ISO 100', 'ISO 200'],
    dof: 'Deep Focus',
    focusDistance: 'Hyperfocal / Infinity',
    sensors: ['Full Frame (35mm)', 'Medium Format (44x33mm)'],
    lightings: ['Golden Hour', 'Blue Hour', 'Natural Daylight'],
    angles: ['Low Angle', 'Eye-Level', "Bird's-Eye View"],
    subjects: [
      { category: 'Landscape', desc: 'terraced coastal cliffs meeting emerald Atlantic surf at dawn', framing: 'Extreme Wide Shot', human: false },
      { category: 'Architecture', desc: 'sandstone colonnade overlooking an ancient quiet courtyard', framing: 'Wide Shot', human: false },
    ],
    environments: ['Mountain', 'Beach', 'Waterfall', 'Architecture'],
    weathers: ['Misty Morning', 'Sunset Atmosphere', 'Clear Weather'],
    colorGradings: ['Cinematic Film Look', 'Fujifilm Inspired', 'Warm Film Look'],
    aspectRatios: ['16:9', '3:2', '21:9'],
  },
  'Wildlife Photography': {
    cameras: ['Mirrorless Camera', 'DSLR Camera'],
    lenses: [
      { lens: '200mm Telephoto', focal: '200mm' },
      { lens: '70-200mm Zoom', focal: '200mm' },
    ],
    apertures: ['f/2.8', 'f/4', 'f/5.6'],
    shutterSpeeds: ['1/2000s', '1/4000s'],
    isos: ['ISO 400', 'ISO 800'],
    dof: 'Shallow Depth of Field',
    focusDistance: 'Mid-Range (4m)',
    sensors: ['Full Frame (35mm)', 'APS-C Crop'],
    lightings: ['Golden Hour', 'Overcast Light', 'Natural Daylight'],
    angles: ['Eye-Level'],
    subjects: [
      { category: 'Animal', desc: 'snowy owl banking silently above frost-covered pine branches', framing: 'Full Body', human: false },
      { category: 'Animal', desc: 'mountain stag standing alert in drifting early-morning valley mist', framing: 'Three-Quarter Body', human: false },
    ],
    environments: ['Forest', 'Mountain'],
    weathers: ['Misty Morning', 'Snowy Weather', 'Sunset Atmosphere'],
    colorGradings: ['True-to-Life Natural Colors', 'Moody Color Grading'],
    aspectRatios: ['3:2', '16:9'],
  },
  'Sports Photography': {
    cameras: ['DSLR Camera', 'Mirrorless Camera'],
    lenses: [
      { lens: '70-200mm Zoom', focal: '135mm' },
      { lens: '200mm Telephoto', focal: '200mm' },
    ],
    apertures: ['f/2.8', 'f/4'],
    shutterSpeeds: ['1/2000s', '1/4000s', '1/8000s'],
    isos: ['ISO 800', 'ISO 1600'],
    dof: 'Shallow Depth of Field',
    focusDistance: 'Mid-Range (4m)',
    sensors: ['Full Frame (35mm)', 'APS-C Crop'],
    lightings: ['Rim Lighting', 'Hard Light', 'Natural Daylight'],
    angles: ['Low Angle', 'Dutch Angle'],
    subjects: [
      { category: 'Male', desc: 'road cyclist climbing a steep misty alpine hairpin turn', framing: 'Full Body', human: true },
      { category: 'Female', desc: 'long jumper mid-flight kicking sand under crisp stadium floodlights', framing: 'Full Body', human: true },
    ],
    environments: ['Mountain', 'Architecture', 'Urban City Street'],
    weathers: ['Clear Weather', 'Nighttime Environment'],
    colorGradings: ['High Contrast', 'Cinematic Film Look'],
    aspectRatios: ['16:9', '3:2'],
  },
};

export function generateCompatibleRandomConfig(): PhotographyConfig {
  const styleItem = pick(PHOTOGRAPHY_STYLES);
  const profile = STYLE_PROFILES[styleItem.id];

  if (profile) {
    const lensChoice = pick(profile.lenses);
    const subj = pick(profile.subjects);
    const composition = pick(COMPOSITION_OPTIONS);
    const quality = pick(QUALITY_OPTIONS);

    return {
      style: styleItem.id,
      cameraType: pick(profile.cameras),
      customCamera: '',
      lens: lensChoice.lens,
      aperture: pick(profile.apertures),
      iso: pick(profile.isos),
      shutterSpeed: pick(profile.shutterSpeeds),
      focalLength: lensChoice.focal,
      depthOfField: profile.dof,
      focusDistance: profile.focusDistance,
      sensorFormat: pick(profile.sensors),
      lighting: pick(profile.lightings),
      customLighting: '',
      cameraAngle: pick(profile.angles),
      composition,
      subjectCategory: subj.category,
      customSubject: subj.desc,
      portraitFraming: subj.framing,
      pose: subj.human ? pick(POSE_OPTIONS) : 'Natural Candid',
      facialExpression: subj.human ? pick(FACIAL_EXPRESSION_OPTIONS) : 'Neutral Expression',
      humanDetails: subj.human ? [...HUMAN_DETAIL_OPTIONS.slice(0, 4)] : [],
      environment: pick(profile.environments),
      weather: pick(profile.weathers),
      customBackground: '',
      colorGrading: pick(profile.colorGradings),
      aspectRatio: pick(profile.aspectRatios),
      quality,
      customDetails: '',
      useEnhancer: true,
    };
  }

  // Fallback logical matching for remaining editorial/cinema/film styles
  const isWideSpace =
    styleItem.id === 'Architecture Photography' || styleItem.id === 'Fine Art Photography';
  const isFood = styleItem.id === 'Food Photography';

  const lensMap = isWideSpace
    ? { lens: '24mm Wide Angle', focal: '24mm', aperture: 'f/8', dof: 'Deep Focus', focus: 'Hyperfocal / Infinity' }
    : isFood
      ? { lens: '105mm Macro', focal: '105mm', aperture: 'f/4', dof: 'Shallow Depth of Field', focus: 'Close Subject (0.8m)' }
      : {
          lens: styleItem.suggestedLens,
          focal: styleItem.suggestedLens.split(' ')[0].includes('-') ? '50mm' : styleItem.suggestedLens.split(' ')[0],
          aperture: styleItem.suggestedAperture,
          dof: 'Shallow Depth of Field',
          focus: 'Portrait Distance (1.8m)',
        };

  const humanSubject = !isWideSpace && !isFood;

  return {
    style: styleItem.id,
    cameraType: styleItem.id === 'Analog Film Photography' ? '35mm Film Camera' : styleItem.id === 'Cinematic Photography' ? 'Cinema Camera' : 'Mirrorless Camera',
    customCamera: '',
    lens: lensMap.lens,
    aperture: lensMap.aperture,
    iso: styleItem.id === 'Analog Film Photography' ? 'ISO 400' : 'ISO 200',
    shutterSpeed: '1/250s',
    focalLength: lensMap.focal,
    depthOfField: lensMap.dof,
    focusDistance: lensMap.focus,
    sensorFormat: 'Full Frame (35mm)',
    lighting: styleItem.id === 'Documentary Photography' ? 'Ambient Lighting' : isFood ? 'Window Light' : 'Golden Hour',
    customLighting: '',
    cameraAngle: isFood ? 'High Angle' : 'Eye-Level',
    composition: pick(COMPOSITION_OPTIONS),
    subjectCategory: isWideSpace ? 'Architecture' : isFood ? 'Object' : pick(['Female', 'Male', 'Couple']),
    customSubject: isWideSpace
      ? 'minimalist limestone pavilion bathed in directional afternoon sun'
      : isFood
        ? 'handmade ceramic bowl of seasonal citrus tart on linen tablecloth'
        : 'creative artisan paused mid-movement in tailored natural textures',
    portraitFraming: isWideSpace ? 'Wide Shot' : isFood ? 'Close-Up' : 'Medium Close-Up',
    pose: humanSubject ? pick(POSE_OPTIONS) : 'Natural Candid',
    facialExpression: humanSubject ? pick(FACIAL_EXPRESSION_OPTIONS) : 'Neutral Expression',
    humanDetails: humanSubject ? ['Natural Skin Texture', 'Realistic Hair Strands', 'Authentic Facial Expressions'] : [],
    environment: isWideSpace ? 'Architecture' : isFood ? 'Cafe' : pick(['Cozy Interior', 'Urban City Street', 'Garden']),
    weather: pick(['Clear Weather', 'Sunset Atmosphere', 'Misty Morning']),
    customBackground: '',
    colorGrading: styleItem.id === 'Analog Film Photography' ? 'Kodak Portra Inspired' : pick(COLOR_GRADING_OPTIONS),
    aspectRatio: pick(ASPECT_RATIO_OPTIONS),
    quality: pick(QUALITY_OPTIONS),
    customDetails: '',
    useEnhancer: true,
  };
}
