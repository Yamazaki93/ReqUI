import { IPersistenceService } from "../persistence/i-persistence";
import { IRequestDict } from "./messages";
import { IRequest } from "../servers/i-server";

export class RequestRepository {
    private persistenceKey = "Requests";
    private requests: IRequestDict = {};
    public constructor(
        private presist: IPersistenceService,
    ) {
    }

    public Save(req: IRequest) {
        if (!req.Name) {
            throw new Error('Request name required to be saved');
        }
        if (!req.Type) {
            throw new Error('Request type is required');
        }
        if (req.Name[req.Name.length - 1] === '/') {
            // remove trailing slash for saving
            req.Name = req.Name.slice(0, req.Name.length - 1);
        }
        this.requests[this.NormalizeName(req.Name)] = req;
        this.SaveAll();
    }

    public DeleteByPath(path: string) {
        if (!path) {
            this.requests = {};
            this.SaveAll();
            return;
        }
        let normalized = this.NormalizeName(path);
        let toRemove = [];
        Object.keys(this.requests).forEach(k => {
            if (normalized.endsWith('/')) {
                if (k.startsWith(normalized)) {
                    toRemove.push(k);
                }
            } else {
                if (k === normalized) {
                    toRemove.push(k);
                }
            }
        });
        toRemove.forEach(k => {
            delete this.requests[k];
        });
        this.SaveAll();
    }

    public Get(key: string) {
        if (!key) {
            throw new Error('Key is required to get request');
        }
        if (!this.requests[key]) {
            throw new Error('Request not found');
        }
        return this.requests[key];
    }

    public GetAll() {
        this.LoadRequests();
        return this.GetDTO();
    }

    private NormalizeName(rawName: string): string {
        let names = rawName.split('/');
        let toAddTrailingSlash = false;
        if (rawName[rawName.length - 1] === '/') {
            toAddTrailingSlash = true;
        }
        names = names.filter(_ => _);
        let path = names.join('/');
        if (toAddTrailingSlash) {
            path += '/';
        }
        return path;
    }

    private GetDTO() {
        let data = JSON.parse(JSON.stringify(this.requests));
        return data;
    }

    private LoadRequests() {
        let loaded = this.presist.Get<IRequestDict>(this.persistenceKey);
        if (!loaded) {
            return;
        }
        this.requests = loaded;
    }

    private SaveAll() {
        this.presist.Set(this.persistenceKey, this.requests);
    }
}
