import { IZoneInfoRow } from "../data/R301";

export interface ZoneListRequest {
}

export interface ZoneListResponse {
    zones: IZoneInfoRow[];
}
