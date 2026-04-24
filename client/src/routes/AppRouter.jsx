
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

/* ── Layouts ─────────────────────────────────────────────────────── */
import AppLayout           from "../components/Layout/AppLayout";
import UserDashboardLayout from "../components/layout/UserDashboardLayout";

/* ── Public pages ────────────────────────────────────────────────── */
import Home               from "../pages/Home/Home";
import About              from "../pages/About/About";
import Contact            from "../pages/Contact/Contact";
import List               from "../pages/List/List";
import Login              from "../pages/Login/Login";
import Register           from "../pages/Register/Register";
import ForgotPassword     from "../pages/ForgotPassword/ForgotPassword";
import SearchResultsPage  from "../pages/SearchResultsPage/SearchResultsPage";
import PropertyDetailPage from "../pages/PropertyDetailPage/PropertyDetailPage";
import PrivacyPolicy      from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService     from "../pages/TermsOfService/TermsOfService";
import Sitemap            from "../pages/Sitemap/Sitemap";

/* ── Dashboard pages ─────────────────────────────────────────────── */
import Overview        from "../pages/dashboard/pages/Overview";
import MyProperties    from "../pages/dashboard/pages/MyProperties";
import AddProperty     from "../pages/dashboard/pages/AddProperty";
import SavedPosts      from "../pages/dashboard/pages/SavedPosts";
import Messages        from "../pages/dashboard/pages/Messages";
import Profile         from "../pages/dashboard/pages/Profile";
import Users           from "../pages/dashboard/pages/Users";
import PropertyDetail  from "../pages/dashboard/pages/Propertydetail";
import EditProperty    from "../pages/dashboard/pages/EditProperty";
import Queries         from "../pages/dashboard/pages/Queries";

const router = createBrowserRouter([

  /* ── Public routes (Header + Footer) ────────────────────────── */
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true,                         element: <Home />               },
      { path: "about",                       element: <About />              },
      { path: "contact",                     element: <Contact />            },
      { path: "list",                        element: <List />               },
      { path: "login",                       element: <Login />              },
      { path: "register",                    element: <Register />           },
      { path: "forgotpassword",              element: <ForgotPassword />     },
      { path: "search-results",              element: <SearchResultsPage />  },
      { path: "property-detail/:id",         element: <PropertyDetailPage /> },
      { path: "privacy-policy",              element: <PrivacyPolicy />      },
      { path: "terms-of-service",            element: <TermsOfService />     },
      { path: "sitemap",                     element: <Sitemap />            },
    ],
  },

  /* ── Dashboard routes (sidebar layout, auth protected) ───────── */
  {
    path: "/dashboard",
    element: <UserDashboardLayout />,
    children: [
      // /dashboard → redirect to /dashboard/overview
      { index: true,              element: <Navigate to="overview" replace /> },

      { path: "overview",         element: <Overview />       },
      { path: "myProperties",     element: <MyProperties />   },
      { path: "addProperty",      element: <AddProperty />    },
      { path: "edit/:postId",     element: <EditProperty />   }, // edit property page with dynamic postId
      { path: "favorites",        element: <SavedPosts />     },
      { path: "messages",         element: <Messages />       },
      { path: "profile",          element: <Profile />        },
      { path: "users",            element: <Users />          },
      { path: "property/:id",     element: <PropertyDetail /> }, // single property detail
      { path: "queries",          element: <Queries />        }, // Queries
    ],
  },

]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;