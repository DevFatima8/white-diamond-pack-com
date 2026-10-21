/**
 * Default values for the `settings` table. The seed inserts these only if the key
 * doesn't exist yet, so values changed later in the admin panel are never overwritten.
 *
 * All values are strings (the table is key → text). Amounts are whole PKR.
 * Empty social links = hidden on the site.
 */
export const SETTING_KEYS = {
  deliveryCharge: 'delivery_charge',
  freeDeliveryThreshold: 'free_delivery_threshold',
  bankDetails: 'bank_details',
  whatsappNumber: 'whatsapp_number',
  contactPhone: 'contact_phone',
  contactEmail: 'contact_email',
  contactAddress: 'contact_address',
  socialFacebook: 'social_facebook',
  socialInstagram: 'social_instagram',
  socialLinkedin: 'social_linkedin',
  socialYoutube: 'social_youtube',
  socialTiktok: 'social_tiktok',
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export const DEFAULT_SETTINGS: Record<SettingKey, string> = {
  delivery_charge: '250',
  free_delivery_threshold: '15000',
  // DUMMY bank details — replace in Admin → Settings before going live.
  bank_details: [
    'Bank: Meezan Bank Ltd.',
    'Account Title: White Diamond',
    'Account No: 0000-0000000000',
    'IBAN: PK00 MEZN 0000 0000 0000 0000',
    'Please send the payment screenshot on WhatsApp with your order number.',
  ].join('\n'),
  whatsapp_number: '923216293333',
  contact_phone: '+92 321 6293333',
  contact_email: 'whitediamond344@gmail.com',
  // DUMMY address — replace with the real one.
  contact_address: 'Small Industrial Estate, Sargodha Road, Faisalabad, Punjab, Pakistan',
  social_facebook: '',
  social_instagram: '',
  social_linkedin: '',
  social_youtube: '',
  social_tiktok: '',
};
