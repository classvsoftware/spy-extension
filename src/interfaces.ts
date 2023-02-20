export interface ILogEntry {
  timestamp: string;
  message: string;
}

export interface IGeolocationEntry {
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
}
