"use client";
import { useState, useEffect } from "react";
import Logout from "./Logout";
import Link from "next/link";
import { useAuth } from "../Auth";
import { useRouter } from "next/navigation";
import { themeChange } from "theme-change";

function Header() {
  const [isLogin, setIsLogin] = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   const fetchProfileData = async () => {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       router.push("/login");
  //       setIsLogin(false);
  //       return;
  //     }

  //     const response = await fetch("http://localhost:3030/profile", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setIsLogin(response.ok);
  //   };

  //   fetchProfileData();
  // }, [router]);

  console.log("login status in Navbar.js: ", isLogin);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    themeChange(false);
  }, []);

  const handleThemeChange = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <nav>
      {/* logo button */}
      <div className="navbar bg-base-300 ">
        <div className="flex-1">
          <Link href="/dashboard" className="btn btn-ghost text-xl">
            ClassMaster
          </Link>
        </div>
        {/* theme control list */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost m-1 bg-base-300"
          >
            Theme
            <svg
              width="12px"
              height="12px"
              className="inline-block h-2 w-2 fill-current opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-base-100 rounded-box z-[1] w-auto p-2 shadow-2xl"
          >
            {[
              "default",
              "light",
              "dark",
              "nord",
              "cupcake",
              "retro",
              "lemonade",
              "coffee",
              "business",
              "dracula",
            ].map((theme) => (
              <li key={theme}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start font-normal"
                  aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
                  value={theme}
                  onChange={() => handleThemeChange(theme)}
                  checked={
                    document.documentElement.getAttribute("data-theme") ===
                    theme
                  }
                />
              </li>
            ))}
          </ul>
        </div>
        {/* dot list */}
        <div className="flex-none dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-square btn-ghost mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-auto p-2 shadow-2xl"
          >
            {isLogin && <Logout />}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
