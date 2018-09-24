import { LocalStorageService } from "@/store/LocalStorageService";
const USER_LOG = "userlog";
const USER_INFO = "userInfo";
export const local_log = new LocalStorageService(USER_LOG, true);
export const local_info = new LocalStorageService(USER_INFO, true);
