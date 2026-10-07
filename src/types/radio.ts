export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export type Language = 'bn' | 'en';

export type RadioBand = 'MW' | 'SW' | 'FM';

export interface CuratedTrack {
  id: string;
  titleBn: string;
  titleEn: string;
  artistBn: string;
  artistEn: string;
  youtubeId: string;
  duration?: string;
}

export interface StationData {
  id: string;
  dayIndex: number;
  frequency: number; // in MHz (e.g. 88.5)
  mwFrequency: number; // in kHz (e.g. 540)
  nameBn: string;
  nameEn: string;
  subTitleBn: string;
  subTitleEn: string;
  dateBn: string;
  dateEn: string;
  youtubeId: string;
  artistBn: string;
  artistEn: string;
  trackTitleBn: string;
  trackTitleEn: string;
  playlist: CuratedTrack[];
  quoteBn: string;
  quoteEn: string;
  quoteAuthorBn: string;
  quoteAuthorEn: string;
  descriptionBn: string;
  descriptionEn: string;
  synthPreset: 'conch-drone' | 'bodhon-flute' | 'saptami-dhak' | 'sandhi-aarti' | 'dhunuchi-fast' | 'sindoor-boron' | 'bijoya-sanai';
  themeColor: string;
}

export interface AtmosphereConfig {
  id: TimeOfDay;
  labelBn: string;
  labelEn: string;
  hourRange: string;
  skyGradient: string;
  overlayScrim: string;
  ambientLightColor: string;
}
