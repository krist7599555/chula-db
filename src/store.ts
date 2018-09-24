import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import {
  LOGIN,
  LOGOUT,
  UPDATE_USER,
  ADD_USER_TO_EVENT,
  PARTICIPATE_EVENT,
  REMOVE_USER_FROM_EVENT
} from "@/store/actions.type";
import { SET_AUTH, PURGE_AUTH, SET_USER_INFO } from "@/store/mutations.type";

import { local_log, local_info } from "@/store/user.storage";
import { auth, provider, db } from "@/common/firebase";
import _ from "lodash";

if (!local_log.get || !local_info.get || !local_log.get.studentCode) {
  local_log.destroy();
  local_info.destroy();
}

const state = {
  userLog: local_log.get,
  userInfo: local_info.get
};

const getters = {
  userLog(state: any): object {
    return state.userLog || {};
  },
  userInfo(state: any): object {
    return state.userInfo || {};
  },
  isAuthenticated(state: any): boolean {
    return !!state.userLog;
  },
  studentCode(state: any): string {
    return (
      _.get(state, "userLog.studentCode") ||
      _.get(state, "userInfo.studentCode") ||
      ""
    );
  },
  userEvent: (state: any) => async (event: string) => {
    if (!getters.isAuthenticated(state)) {
      return null;
    }
    let snapshot = await db
      .doc(`events/${event}/records/${getters.studentCode(state)}`)
      // .collection("events")
      // .doc(eventCode)
      // .collection("records")
      // .doc(state.getters.studentCode)
      .get();
    return snapshot.exists ? snapshot.data() : undefined;
  },
  eventRecords: (state: any) => async (event: string) => {
    let d = await db
      .collection(`events/${event}/records`)
      // .collection("events")
      // .doc(event)
      // .collection("records")
      .get();
    return _.map(d.docs, _ => _.data());
  },
  deviceNavigateInfo(): string {
    return navigator.userAgent || navigator.vendor || "";
  }
};

const actions = {
  async setStudentCode(context: any) {
    console.log("set student code");
    console.assert(context.getters.isAuthenticated);
    let user = context.state.userLog;
    console.log("email" in user);
    let studentCode = await db
      .collection("authdata")
      .doc(user.email)
      .get();
    let matchId = /^[0-9]{10}$/g;
    if (studentCode.exists) {
      user.studentCode = studentCode.data()!.studentCode;
      if (matchId.test(user.studentCode)) {
        context.commit(SET_AUTH, user);
        return;
      }
    }
    if (!matchId.test(user.studentCode)) {
      console.log("not matxh");
      let ok = false;
      let uid1, uid2;
      while (!ok) {
        uid1 = prompt("10 digit student code") || "";
        uid2 = prompt("10 digit student code again!") || "";
        ok = uid1 == uid2 && !!matchId.test(uid1);
        if (!ok) alert("student code is not match. please retyping");
      }
      user.studentCode = uid1;
      await db
        .collection("authdata")
        .doc(user.email)
        .set({ studentCode: uid1 }, { merge: true });
      context.commit(SET_AUTH, user);
    } else {
      console.log("cache");
    }
  },
  async [LOGIN](context: any): Promise<void> {
    let user_info = await auth().signInWithPopup(provider);
    let user = {
      studentCode: "",
      photoURL: "",
      access_token: user_info.credential,
      ...user_info!.user!.providerData[0]
    };
    user.photoURL += "?width=500&height=500";
    context.commit(SET_AUTH, user);
    console.assert(context.getters.isAuthenticated);
    while (!/^[0-9]{10}$/g.test(context.getters.userLog.studentCode)) {
      await context.dispatch("setStudentCode");
    }
    let studentCode = context.getters.userLog.studentCode;
    let userInfo = await db
      .doc(`records/${studentCode}`)
      // .collection("records")
      // .doc(studentCode)
      .get();
    let data = userInfo.data();
    context.commit(SET_USER_INFO, data);
  },
  async [LOGOUT](context: any): Promise<void> {
    await auth()
      .signOut()
      .then(() => {
        context.commit(PURGE_AUTH);
      });
  },
  async [UPDATE_USER](context: any, newuserInfo: object): Promise<void> {
    console.log('UPDATE_USER', (await db.doc(`records/${context.getters.studentCode}`).get()));
    return db
      .doc(`records/${context.getters.studentCode}`)
      // .collection("records")
      // .doc(context.getters.studentCode)
      .set(newuserInfo, { merge: true })
      .then(() => {
        return context.commit(SET_USER_INFO, newuserInfo);
      })
  },
  async [ADD_USER_TO_EVENT](context: any, { event, data }: any): Promise<void> {
    let docRef = await db.doc(
      `events/${event}/records/${context.getters.studentCode}`
    );
    // .collection("events")
    // .doc(event)
    // .collection("records")
    // .doc(context.getters.studentCode);
    console.log('add user to event')
    await docRef.set(data, { merge: true });
  },
  async [REMOVE_USER_FROM_EVENT](context: any, event: string) {
    await context.dispatch("setStudentCode");
    let docRef = await db.doc(
      `events/${event}/records/${context.getters.studentCode}`
    );
    // .collection("events")
    // .doc(event)
    // .collection("records")
    // .doc(context.getters.studentCode);
    return docRef.delete().then(() => {
      alert("delete event success");
    });
  },
  async checkIn(context: any, { event, studentCode }: any) {
    console.assert(context.getters.isAuthenticated);
    console.assert(event && studentCode);
    let me_code = context.getters.studentCode;
    let me_ref = await db.doc(`events/${event}/records/${me_code}`);
    // .collection("events")
    // .doc(event)
    // .collection("records")
    // .doc(me_code);
    let me = (await me_ref.get()).data() || {};
    if (me.stat != "checker") {
      return {
        success: false,
        message: `${me_code}\npermission denied`
      };
    }
    let ref = await db.doc(`events/${event}/records/${studentCode}`);
    // .collection("events")
    // .doc(event)
    // .collection("records")
    // .doc(studentCode);
    let data = (await ref.get()).data() || {};
    console.log("her data data:", data);
    console.log("her data stat:", data.stat);
    if (!data.stat) {
      ref.set({ stat: me_code }, { merge: true });
      let new_stat: string = (await ref.get()).data()!.stat;
      console.log("new stat is", new_stat);
      console.assert(new_stat == "checker" || /[0-9]{10}/g.test(new_stat));
      if (new_stat != "checker" && !/[0-9]{10}/g.test(new_stat)) {
        alert("internal error");
        return {
          success: false,
          message: "internal error",
          respond: {}
        };
      }
    }
    return {
      success: true,
      respond: (await ref.get()).data()
    };
  }
};

const mutations = {
  [SET_AUTH](state: any, data: object): object {
    console.log("set auth");
    local_log.save(data || {});
    state.userLog = local_log.get;
    console.assert(state.userLog != null);
    return data;
  },
  [PURGE_AUTH](state: any) {
    local_log.destroy();
    local_info.destroy();
    state.userLog = local_log.get;
    state.userInfo = local_info.get;
    console.assert(state.userLog == null);
    console.assert(state.userInfo == null);
    console.log("perge", state);
  },
  [SET_USER_INFO](state: any, data: object): object {
    local_info.save(data || {});
    state.userInfo = local_info.get;
    console.assert(state.userInfo != null);
    return data;
  }
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
});
