
export interface Musician {
  id: string;
  name: string;
  active: boolean;
}

export interface Instrument {
  id: string;
  name: string;
  active: boolean;
}

export interface ServiceMusician {
  musicianId: string;
  instrumentId: string;
}

export interface ServiceDay {
  id: string; // ISO string for the day
  title?: string; // Custom name for the meeting
  directors: string[]; // Musician IDs
  singers: string[]; // Musician IDs
  instrumentalists: ServiceMusician[];
}

export type ViewType = 'calendar' | 'list';
export type MainTab = 'calendar' | 'musics';
