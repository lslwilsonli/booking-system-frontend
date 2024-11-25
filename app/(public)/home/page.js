"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  const handleOnClick = () => {
    router.push("/register");
  };

  return (
    <div className="bg-[E3E5E6] h-screen relative">
      <div className="left-container flex flex-col gap-3 mt-20 ml-28 absolute lg:w-[35%]">
        {/* Title */}
        <h1 className="text-[#4c71ef] text-4xl font-bold font-[Montserrat]">
          Simplify Management, <br />
          Elevate Experiences
        </h1>
        <div className="divider w-48 h-0"></div>
        <p className=" text-xl mb-3 ">
          The ultimate solution for{" "}
          <span className="text-[#4c71ef] font-bold">SMEs</span> (Small and
          Medium-sized Enterprises). Our user-friendly management system
          streamlines your operations, empower your business to grow
          effortlessly.
        </p>

        <ul className=" text-md flex flex-col italic mb-3">
          <li>
            <span className="badge badge-neutral mb-2 mr-2">1</span>
            Personalized booking experience with unique URLs.
          </li>
          <li>
            <span className="badge badge-neutral mb-2 mr-2">2</span>Valuable
            insights with course performance statistics.
          </li>
          <li>
            <span className="badge badge-neutral mb-2 mr-2">3</span>Simplify the
            booking and checkout process.
          </li>
        </ul>

        <div className="flex flex-row items-center">
          <button
            className="btn btn-wide btn-primary "
            type="submit"
            onClick={handleOnClick}
          >
            {/* <a href="/register">TRY NOW</a> */}
            TRY NOW
          </button>
          <div className="ml-5">
            or
            <Link href="/" className="link ml-3">
              Log In
            </Link>
            {/* <a className="link ml-5 " href="/">
              or Log In
            </a> */}
          </div>
        </div>
      </div>

      {/* Image */}
      <img
        className="absolute h-auto top-12 right-32 w-[48%]"
        src="https://i.ibb.co/Jx3S0h4/classmaster-computer.png"
      ></img>
      <img
        className="absolute h-[70%] w-auto top-48 lg:right-5"
        src="https://i.ibb.co/s526Rz5/classmaster-iphone.png"
      ></img>
    </div>
  );
}
