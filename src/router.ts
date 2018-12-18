import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/home/index.vue";
import Person from "@/views/person/index.vue";
import Login from "@/views/login/index.vue";
import EventComp from "@/views/event/index.vue";
import EventQR from "@/views/event/EventQR.vue";
import EventMenu from "@/views/event/EventMenu.vue";
import EventOverview from "@/views/event/EventOverview.vue";
import EventSelfCheckIn from "@/views/event/EventSelfCheckIn.vue";
import NotFoundComponent from "@/views/notFound/index.vue";
import BarcodeScanner from "@/views/utility/BarcodeScanner.vue";
import CheckIn from "@/views/checkin/index.vue";
import Authentication from '@/views/auth/index.vue';

Vue.use(Router);
import $store from "@/store";

const router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/profile",
      redirect: "/users"
    },
    {
      path: "/self",
      redirect: "/users"
    },
    {
      path: "/users/:id",
      name: "Users",
      // redirect: "/users/:id/public",
      component: Person,
      props: true,
      children: [
        {
          path: "public",
          name: "personPublic",
          component: () => import("@/views/person/subtab/public.vue")
        },
        {
          path: "protected",
          name: "personProtected",
          component: () => import("@/views/person/subtab/protected.vue")
        },
        {
          path: "event",
          name: "personEvent",
          component: () => import("@/views/person/subtab/event.vue")
        },
        {
          path: "surway",
          name: "personSurway",
          component: () => import("@/views/person/subtab/surway.vue")
        },
        {
          path: "all",
          name: "personAll",
          component: () => import("@/views/person/subtab/all.vue")
        }
      ]
    },
    {
      path: "/event",
      name: "eventMenu",
      component: EventMenu
    },
    {
      path: "/event/:id",
      name: "eventComp",
      component: EventComp,
      props: true
    },
    {
      path: "/event/:id/qr",
      name: "eventQR",
      component: EventQR,
      props: true
    },
    {
      path: "/event/:id/checkin",
      name: "EventSelfCheckIn",
      component: EventSelfCheckIn,
      props: true
    },
    {
      path: "/event/:id/records",
      name: "eventComp",
      component: EventOverview,
      props: true
    },
    {
      path: "*",
      name: "notFound",
      component: NotFoundComponent
    },
    {
      path: "/course",
      name: "Course",
      component: () => import("@/views/utility/course.vue")
    },
    {
      path: "/barcode",
      name: "BarcodeScanner",
      component: BarcodeScanner
    },
    {
      path: "/checkin",
      name: "CheckIn",
      component: CheckIn
    },
    {
      path: "/auth",
      name: "Authentication",
      component: Authentication
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (RegExp("/users/[0-9]+").test(to.fullPath)) {
    if (to.fullPath.indexOf($store.getters.studentCode) != -1) {
      next();
    } else {
      next("/");
    }
  } else if (to.fullPath == "/users" || to.fullPath == "/users/") {
    next(
      $store.getters.isAuthenticated
        ? `/users/${$store.getters.studentCode}`
        : `/users/_`
    );
  } else {
    next();
  }
});
export default router;
