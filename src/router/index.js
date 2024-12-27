import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView";
import LoginView from "../views/LoginView";
import StudentsView from "../views/StudentsView";
import CreateStudentView from "../views/CreateStudentView";
import SubmitReportView from "../views/SubmitReportView";
import StudentReportsView from "../views/StudentReportsView";
import UnauthorizeView from "../views/UnauthorizeView";
import NotFoundView from "../views/NotFoundView";
import PGSA from "../views/PGSA";


const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/wx?limit=6&reused=pgsa_latest&tsv=2PACX-1vSbYtpAD_wZmkcwxwpb14CVWU-MM7mcFAw8GAegcZ6qVWXyj2LkXIvhjxgRg7i80wOFNIEOBNW4Er8r,0,R1C4",
    name: "PGSA",
    component: PGSA,
  },
  {
    path: "/authorized",
    name: "unauthorized",
    component: UnauthorizeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/view-student",
    name: "view-student",
    component: StudentsView,
    meta: { requiresAuth: true, roles: ["admin", "teacher"] },
  },
  {
    path: "/create-student",
    name: "create-student",
    component: CreateStudentView,
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/submit-report",
    name: "submit-report",
    component: SubmitReportView,
    meta: { requiresAuth: true, roles: ["student"] },
  },
  {
    path: "/view-student-report/:userId",
    name: "StudentReportsView",
    component: StudentReportsView,
    meta: { requiresAuth: true, roles: ["student", "teacher"] },
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("token"); // Simulate authentication state
  const userRole = sessionStorage.getItem("role"); // Get the user's role

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    if (!token) {
      // Redirect to login if token is missing
      return next({ path: "/login", query: { redirect: to.fullPath } });
    }

    // Check if the route requires a specific role
    if (!(to.meta.roles && to.meta.roles.includes(userRole))) {
      // Redirect to unauthorized page
      return next({ path: "/authorized" });
    }
  }

  // Proceed to the route
  next();
});

export default router;
