import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Babble</h1>
        <div className="space-x-4">
          <Link href="/" className="text-white hover:underline">
            Home
          </Link>
          <Link
            href="https://my-personal-portfolio-website-beta.vercel.app/"
            className="text-white hover:underline"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
