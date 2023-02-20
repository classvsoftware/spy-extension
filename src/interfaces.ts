export interface ILogEntry {
  timestamp: number;
  message: string;
}

export interface IGeolocationEntry {
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
}
