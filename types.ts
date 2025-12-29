export enum PhotoType {
  PASSPORT = 'Passport',
  VISA = 'Visa',
  ID_CARD = 'ID Card',
  CV = 'CV / Resume'
}

export interface GeneratedPhoto {
  type: PhotoType;
  imageUrl: string | null;
  loading: boolean;
  error?: string;
}

export interface PhotoConfig {
  type: PhotoType;
  bgColor: string;
  clothing: string;
  description: string;
}

export const PHOTO_CONFIGS: Record<PhotoType, PhotoConfig> = {
  [PhotoType.PASSPORT]: {
    type: PhotoType.PASSPORT,
    bgColor: 'solid white',
    clothing: 'formal dark business suit and tie',
    description: 'Standard passport size, white background, neutral expression.'
  },
  [PhotoType.VISA]: {
    type: PhotoType.VISA,
    bgColor: 'off-white or very light grey',
    clothing: 'formal business attire',
    description: 'Visa compliant, light background, clear facial features.'
  },
  [PhotoType.ID_CARD]: {
    type: PhotoType.ID_CARD,
    bgColor: 'light blue',
    clothing: 'formal suit',
    description: 'Official ID card style, blue background, sharp contrast.'
  },
  [PhotoType.CV]: {
    type: PhotoType.CV,
    bgColor: 'professional light grey studio gradient',
    clothing: 'modern professional business suit',
    description: 'Professional profile photo, approachable yet formal.'
  }
};