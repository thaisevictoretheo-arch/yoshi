import { CompanyPhoto, SectionImage } from '../types';

// Curated authentic photography pool with high-resolution real subjects (No cheap AI slop or broken links)
export const CURATED_NICHE_IMAGES: Record<string, string[]> = {
  'barber-chair': [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80'
  ],
  'fade-cut': [
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1600&q=80'
  ],
  'straight-razor': [
    'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1593702295094-aea22597af65?auto=format&fit=crop&w=1600&q=80'
  ],
  'hair-styling': [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80'
  ],
  'hair-salon-interior': [
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1600&q=80'
  ],
  'restaurant-interior': [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80'
  ],
  'plated-food': [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80'
  ],
  'pizza-oven': [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1600&q=80'
  ],
  'latte-art': [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80'
  ],
  'crusty-bread': [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1600&q=80'
  ],
  'patisserie-display': [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1600&q=80'
  ],
  'clean-clinic-interior': [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80'
  ],
  'dental-chair': [
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600&q=80'
  ],
  'gym-weights': [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80'
  ],
  'grooming-dog': [
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1600&q=80'
  ],
  'modern-facade': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
  ],
  'woodworking-tools': [
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1530631673369-bc20fdb32288?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80'
  ],
  'custom-kitchen': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80'
  ],
  'fashion-editorial': [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80'
  ],
  'photo-studio': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1600&q=80'
  ],
  'architect-blueprints': [
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
  ],
  'sunlit-living-room': [
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80'
  ],
  'mechanic-tools': [
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=80'
  ],
  'electrical-panel': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80'
  ],
  'spa-ambiance': [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=80'
  ],
  'modern-office': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80'
  ]
};

// Fallback thematic abstract architectural texture images (for zero broken images guarantee)
export const TEXTURAL_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80', // architectural concrete
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80', // warm textured abstract
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80', // museum minimalist gallery
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80'  // dark stone texture
];

export interface ImageSlotRequest {
  id: string;
  role: 'hero' | 'service' | 'atmosphere' | 'detail' | 'portfolio' | 'product';
  subjectTag?: string;
  preferredAspectRatio?: string;
  seed: number;
}

export function resolveImageForSlot(
  request: ImageSlotRequest,
  realPhotos: CompanyPhoto[],
  nichePhotoSubjects: string[]
): SectionImage {
  // 1. Check if there is a real photo matching this role
  const matchingRealPhoto = realPhotos.find((p) => p.role === request.role);
  if (matchingRealPhoto) {
    return {
      id: request.id,
      url: matchingRealPhoto.url,
      alt: matchingRealPhoto.caption || `Foto real da empresa — ${request.role}`,
      role: request.role,
      factualOrDecorative: 'factual',
      aspectRatio: request.preferredAspectRatio || '16/9',
      focalPoint: matchingRealPhoto.focalPoint || { x: 50, y: 50 },
      caption: matchingRealPhoto.caption
    };
  }

  // 2. If there's any unused real photo, prioritize it for the hero or portfolio
  const unusedRealPhoto = realPhotos[Math.abs(request.seed) % Math.max(1, realPhotos.length)];
  if (unusedRealPhoto && (request.role === 'hero' || request.role === 'portfolio')) {
    return {
      id: request.id,
      url: unusedRealPhoto.url,
      alt: unusedRealPhoto.caption || 'Foto real do espaço',
      role: request.role,
      factualOrDecorative: 'factual',
      aspectRatio: request.preferredAspectRatio || '16/9',
      focalPoint: unusedRealPhoto.focalPoint || { x: 50, y: 50 }
    };
  }

  // 3. Fallback to curated high-quality niche authentic photography
  const tag = request.subjectTag || nichePhotoSubjects[Math.abs(request.seed) % nichePhotoSubjects.length] || 'modern-office';
  const pool = CURATED_NICHE_IMAGES[tag] || CURATED_NICHE_IMAGES['modern-office'] || TEXTURAL_FALLBACK_IMAGES;
  const pickedUrl = pool[Math.abs(request.seed) % pool.length] || TEXTURAL_FALLBACK_IMAGES[0];

  return {
    id: request.id,
    url: pickedUrl,
    alt: `Atmosfera e referências visuais de ${tag.replace('-', ' ')}`,
    role: request.role,
    factualOrDecorative: 'decorative', // Marked strictly as decorative so it is never misrepresented as actual client work!
    aspectRatio: request.preferredAspectRatio || '16/9',
    focalPoint: { x: 50, y: 50 }
  };
}
