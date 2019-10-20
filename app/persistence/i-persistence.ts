export interface IPersistenceService {
    Set(key: string, value: any);
    Get<T>(key: string): T;
}
