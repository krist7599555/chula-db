export class LocalStorageService {
  private object: string;
  private json: boolean;

  constructor(object: string, json: boolean = true) {
    this.object = object;
    this.json = json;
  }

  get get() {
    return this.json
      ? window.localStorage.getItem(this.object) &&
          JSON.parse(window.localStorage.getItem(this.object) as string)
      : window.localStorage.getItem(this.object);
  }

  public save(value: object | string) {
    window.localStorage.setItem(this.object, (this.json
      ? JSON.stringify(value)
      : value) as string);
  }

  public destroy() {
    console.log("destroy x ", this.object);
    window.localStorage.removeItem(this.object);
  }
}
