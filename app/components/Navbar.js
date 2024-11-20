"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar({ children }) {
  // const pathname = usePathname();
  // const bookPath = pathname?.startsWith("/book");
  // const loginPath = pathname?.startsWith("/login");
  // const registerPath = pathname?.startsWith("/register");
  // const dashboardPath = pathname?.startsWith("/dashboard");

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col ml-4">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Menu
          </label>
          {/* Content here */}
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-72 p-4  ">
            {/* Sidebar content here */}

            <li>
              <Link className="text-lg" href="/dashboard">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-lg" href="/dashboard/participant">
                Participant
              </Link>
            </li>
            <li>
              <Link className="text-lg" href="/dashboard/program">
                Programs
              </Link>
            </li>
            <li>
              <Link className="text-lg" href="/dashboard/calender">
                Calender
              </Link>
            </li>
            <li>
              <Link className="text-lg" href="/profile">
                Profile
              </Link>
            </li>
            <li>
              <Link className="text-lg" href="/dashboard/payment">
                Payment
              </Link>
            </li>
            <li>
              <Link className="text-lg" href="/dashboard/payment_v2">
                Payment_v2
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  // if (dashboardPath) {

  // } else {
  //   return (
  //     <header>
  //       <Navbar />
  //       {children}
  //     </header>
  //   );
  // }
}
