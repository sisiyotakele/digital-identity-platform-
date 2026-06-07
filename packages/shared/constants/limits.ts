export const LIMITS = {
    MAX_CARDS_PER_USER: 10,
    MAX_SOCIAL_LINKS_PER_CARD: 8,
    MAX_BIO_LENGTH: 300,
    MAX_PHOTO_SIZE_MB: 5,
    MAX_LOGO_SIZE_MB: 2,
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    CARD_SLUG_MIN_LENGTH: 3,
    CARD_SLUG_MAX_LENGTH: 50,
} as const
