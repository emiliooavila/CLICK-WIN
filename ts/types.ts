export interface Participant {
  id: string;
  name: string;
  isOrganizer: boolean;
  order: number;
}

export interface Exclusion {
  giverId: string;
  excludedIds: string[];
}

export interface EventData {
  organizerName:    string;
  includeOrganizer: boolean;
  eventType:        string;
  eventName:        string;
  eventDate:        string;
  budget:           string;
}

export interface DrawResult {
  giverId:      string;
  giverName:    string;
  receiverId:   string;
  receiverName: string;
}