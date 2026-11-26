import { CompatibilityIssue, PhotographyConfig } from '../types/photography';

const WIDE_LENSES = ['16mm Ultra Wide', '24mm Wide Angle'];
const TELEPHOTO_LENSES = ['135mm Telephoto', '200mm Telephoto', '70-200mm Zoom'];
const PORTRAIT_PRIMES = ['50mm Standard Prime', '85mm Portrait', '135mm Telephoto'];
const WIDE_APERTURES = ['f/1.2', 'f/1.4', 'f/1.8', 'f/2'];
const NARROW_APERTURES = ['f/8', 'f/11', 'f/16'];

export function evaluateCompatibility(config: PhotographyConfig): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  // 1. Macro Photography checks
  if (config.style === 'Macro Photography') {
    if (config.lens !== '105mm Macro') {
      issues.push({
        id: 'macro-lens',
        severity: 'warning',
        title: 'Macro Lens Recommended',
        message: `${config.lens} cannot achieve true 1:1 close magnification. A 105mm Macro lens yields crisp micro-detail and working distance.`,
        recommendationLabel: 'Switch to 105mm Macro',
        patch: {
          lens: '105mm Macro',
          focalLength: '105mm',
          focusDistance: 'Extreme Close-Up (0.15m)',
        },
      });
    }
    if (config.focusDistance !== 'Extreme Close-Up (0.15m)' && config.focusDistance !== 'Close Subject (0.8m)') {
      issues.push({
        id: 'macro-focus-distance',
        severity: 'tip',
        title: 'Close Focus Distance',
        message: 'Macro scenes require close focusing distance (0.15m–0.8m) rather than mid-range or infinity focus.',
        recommendationLabel: 'Set Close Focus (0.15m)',
        patch: { focusDistance: 'Extreme Close-Up (0.15m)' },
      });
    }
  }

  // 2. Portrait Photography checks
  if (
    config.style === 'Portrait Photography' ||
    config.style === 'Editorial Photography' ||
    config.style === 'Wedding Photography'
  ) {
    if (WIDE_LENSES.includes(config.lens) && ['Extreme Close-Up', 'Close-Up', 'Headshot', 'Medium Close-Up'].includes(config.portraitFraming)) {
      issues.push({
        id: 'portrait-wide-distortion',
        severity: 'warning',
        title: 'Wide-Angle Facial Distortion',
        message: `${config.lens} at ${config.portraitFraming} exaggerates facial proportions. 50mm or 85mm primes give natural compression.`,
        recommendationLabel: 'Use 85mm Portrait',
        patch: { lens: '85mm Portrait', focalLength: '85mm', aperture: 'f/1.8' },
      });
    }
    if (NARROW_APERTURES.includes(config.aperture) && config.depthOfField === 'Ultra Shallow Bokeh') {
      issues.push({
        id: 'aperture-dof-conflict',
        severity: 'warning',
        title: 'Aperture vs. Depth of Field Conflict',
        message: `${config.aperture} produces deep sharpness and contradicts "Ultra Shallow Bokeh".`,
        recommendationLabel: 'Set f/1.8 for Shallow Bokeh',
        patch: { aperture: 'f/1.8', depthOfField: 'Shallow Depth of Field' },
      });
    }
  }

  // 3. Landscape & Architecture checks
  if (config.style === 'Travel Photography' || config.style === 'Architecture Photography') {
    if (WIDE_APERTURES.includes(config.aperture) && (config.subjectCategory === 'Landscape' || config.subjectCategory === 'Architecture')) {
      issues.push({
        id: 'landscape-shallow-aperture',
        severity: 'warning',
        title: 'Shallow Aperture on Scenic Frame',
        message: `Shooting ${config.style} at ${config.aperture} softens distant textures. Stopping down to f/8–f/11 preserves edge-to-edge clarity.`,
        recommendationLabel: 'Set f/11 Deep Focus',
        patch: {
          aperture: 'f/11',
          depthOfField: 'Edge-to-Edge Sharpness',
          focusDistance: 'Hyperfocal / Infinity',
        },
      });
    }
    if (config.style === 'Architecture Photography' && !WIDE_LENSES.includes(config.lens) && config.lens !== '24-70mm Zoom') {
      issues.push({
        id: 'arch-lens-tip',
        severity: 'tip',
        title: 'Wide Focal Length Helpful',
        message: 'Architecture frames benefit from a 24mm Wide Angle or 16mm Ultra Wide lens to capture full facades.',
        recommendationLabel: 'Use 24mm Wide Angle',
        patch: { lens: '24mm Wide Angle', focalLength: '24mm' },
      });
    }
  }

  // 4. Wildlife Photography checks
  if (config.style === 'Wildlife Photography' && !TELEPHOTO_LENSES.includes(config.lens)) {
    issues.push({
      id: 'wildlife-telephoto',
      severity: 'warning',
      title: 'Telephoto Reach Recommended',
      message: `${config.lens} requires getting dangerously close to wildlife. A 200mm Telephoto or 70-200mm Zoom is standard.`,
      recommendationLabel: 'Switch to 200mm Telephoto',
      patch: { lens: '200mm Telephoto', focalLength: '200mm', aperture: 'f/4' },
    });
  }

  // 5. Street Photography checks
  if (config.style === 'Street Photography') {
    if (['200mm Telephoto', '105mm Macro'].includes(config.lens)) {
      issues.push({
        id: 'street-lens',
        severity: 'tip',
        title: 'Classic Street Focal Length',
        message: '35mm Documentary or 50mm Standard Prime preserves environmental context and candid proximity better than long telephotos.',
        recommendationLabel: 'Use 35mm Documentary',
        patch: { lens: '35mm Documentary', focalLength: '35mm' },
      });
    }
    if (config.lighting === 'Studio Softbox Lighting' || config.lighting === 'Butterfly Lighting') {
      issues.push({
        id: 'street-studio-lighting',
        severity: 'warning',
        title: 'Studio Lighting Outdoors',
        message: `${config.lighting} feels artificial for candid Street Photography. Natural Daylight, Blue Hour, or Practical Lighting fits better.`,
        recommendationLabel: 'Use Practical Lighting',
        patch: { lighting: 'Practical Lighting' },
      });
    }
  }

  // 6. Product Photography checks
  if (config.style === 'Product Photography') {
    if (config.lighting === 'Silhouette Lighting' || config.lighting === 'Hard Light') {
      issues.push({
        id: 'product-lighting',
        severity: 'tip',
        title: 'Controlled Product Illumination',
        message: 'Product photography prioritizes Studio Softbox Lighting or Window Light to keep brand details legible.',
        recommendationLabel: 'Use Studio Softbox Lighting',
        patch: { lighting: 'Studio Softbox Lighting', aperture: 'f/8', depthOfField: 'Edge-to-Edge Sharpness' },
      });
    }
  }

  // 7. Documentary Photography checks
  if (config.style === 'Documentary Photography') {
    if (['Studio Softbox Lighting', 'Butterfly Lighting', 'Rembrandt Lighting'].includes(config.lighting)) {
      issues.push({
        id: 'doc-natural-light',
        severity: 'warning',
        title: 'Staged Lighting in Documentary Mode',
        message: `${config.lighting} looks staged for Documentary Photography. Natural Daylight, Ambient, or Window Light preserves authenticity.`,
        recommendationLabel: 'Switch to Ambient Lighting',
        patch: { lighting: 'Ambient Lighting' },
      });
    }
  }

  // 8. Sports Photography shutter speed check
  if (config.style === 'Sports Photography' && ['1/30s', '1/15s', '1s Long Exposure'].includes(config.shutterSpeed)) {
    issues.push({
      id: 'sports-shutter',
      severity: 'warning',
      title: 'Slow Shutter for Fast Action',
      message: `${config.shutterSpeed} will cause heavy motion blur on fast athletes unless intentional panning is desired.`,
      recommendationLabel: 'Set 1/2000s Freeze Action',
      patch: { shutterSpeed: '1/2000s', lens: '70-200mm Zoom', focalLength: '135mm' },
    });
  }

  // 9. Global optical check: wide aperture with deep focus
  if (
    WIDE_APERTURES.includes(config.aperture) &&
    (config.depthOfField === 'Deep Focus' || config.depthOfField === 'Edge-to-Edge Sharpness') &&
    !issues.some((i) => i.id === 'aperture-dof-conflict')
  ) {
    issues.push({
      id: 'global-aperture-dof',
      severity: 'warning',
      title: 'Optical Contradiction',
      message: `${config.aperture} creates shallow falloff and conflicts with "${config.depthOfField}".`,
      recommendationLabel: 'Match f/8 for Deep Focus',
      patch: { aperture: 'f/8' },
    });
  }

  // 10. Global check: Narrow aperture with Ultra Shallow Bokeh
  if (
    NARROW_APERTURES.includes(config.aperture) &&
    (config.depthOfField === 'Ultra Shallow Bokeh' || config.depthOfField === 'Shallow Depth of Field') &&
    !issues.some((i) => i.id === 'aperture-dof-conflict')
  ) {
    issues.push({
      id: 'global-narrow-bokeh',
      severity: 'warning',
      title: 'Insufficient Bokeh Aperture',
      message: `${config.aperture} keeps backgrounds relatively sharp instead of producing "${config.depthOfField}".`,
      recommendationLabel: 'Open up to f/2',
      patch: { aperture: 'f/2' },
    });
  }

  // 11. Portrait style general check if user picked extreme wide 16mm
  if (config.style === 'Portrait Photography' && !PORTRAIT_PRIMES.includes(config.lens) && !issues.some((i) => i.id === 'portrait-wide-distortion')) {
    if (config.lens === '16mm Ultra Wide') {
      issues.push({
        id: 'portrait-16mm',
        severity: 'warning',
        title: '16mm Ultra Wide for Portraits',
        message: '16mm introduces perspective distortion on faces. 50mm or 85mm lenses are recommended for classic portraits.',
        recommendationLabel: 'Use 85mm Portrait',
        patch: { lens: '85mm Portrait', focalLength: '85mm' },
      });
    }
  }

  return issues;
}
