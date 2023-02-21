interface ILogEntry {
  uuid: string;
  timestamp: string;
}

export interface IActivityLogEntry extends ILogEntry {
  message: string;
}

export interface IGeolocationEntry extends ILogEntry {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface IKeyLogEntry extends ILogEntry {
  url: string;
  buffer: string;
}

export interface INavigationLogEntry extends ILogEntry {
  url: string;
}

export interface IScreenshotLogEntry extends ILogEntry {
  imageData: string;
  url: string;
}

// export interface IInputsData extends ILogEntry {
//     url: string;
// }

export interface IRequestData extends ILogEntry {
  request: chrome.webRequest.WebRequestBodyDetails;
}

export interface INoteEntry extends ILogEntry {
  text: string;
}
