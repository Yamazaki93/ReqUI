import { RequestRepository } from "./request-repository";
import { IMessenger } from "../messaging/i-messenger";
import { LoadRequestsCommand, RequestsLoadedEvent, SaveRequestCommand, RequestSavedEvent, DeleteRequestByPath } from "./messages";

export class RequestRepositoryMessagingAdapter {
    public constructor(
        private repo: RequestRepository,
        private messenger: IMessenger,
    ) {
        messenger.Receive('Requests.Load', (m: LoadRequestsCommand) => {
            this.OnLoadRequests(m);
        });
        messenger.Receive('Requests.Save', (m: SaveRequestCommand) => {
            this.OnSaveReuqest(m);
        });
        messenger.Receive('Requests.DeleteByPath', (m: DeleteRequestByPath) => {
            this.OnDeleteRequestByPath(m);
        });
    }

    private OnLoadRequests(c: LoadRequestsCommand) {
        let data = this.repo.GetAll();
        this.messenger.Send(new RequestsLoadedEvent(data));
    }
    private OnSaveReuqest(c: SaveRequestCommand) {
        this.repo.Save(c.Request);
        let data = this.repo.GetAll();
        this.messenger.Send(new RequestsLoadedEvent(data));
    }
    private OnDeleteRequestByPath(c: DeleteRequestByPath) {
        this.repo.DeleteByPath(c.Path);
        let data = this.repo.GetAll();
        this.messenger.Send(new RequestsLoadedEvent(data));
    }
}
