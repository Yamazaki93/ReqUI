import { IPersistenceService } from "./i-persistence";
import * as fs from 'fs';
import * as path from 'path';

export class LocalFilePersistenceService implements IPersistenceService {
    private dataFilePath: string;
    private data: {
        [key: string]: any,
    } = {};
    public constructor(folder: string) {
        this.dataFilePath = path.join(folder, "data.json");
        if (!fs.existsSync(this.dataFilePath)) {
            this.save();
        }
    }
    public Set(key: string, value: any) {
        if (!key) {
            throw new Error("Key is required to set data");
        }
        this.data[key] = value;
        this.save();
    }
    public Get<T>(key: string): T {
        this.load();
        return this.data[key];
    }

    private save() {
        fs.writeFileSync(this.dataFilePath, JSON.stringify(this.data), 'utf8');
    }
    private load() {
        this.data = JSON.parse(fs.readFileSync(this.dataFilePath).toString());
    }
}
