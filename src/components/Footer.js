import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-4 text-center">
      <p>
        &copy; {new Date().getFullYear()} AI Powered Voice Note Taking App. All
        rights reserved.
      </p>
      <div>
        <a
          href="https://my-personal-portfolio-website-beta.vercel.app/"
          className="text-white hover:text-gray-300"
        >
          Portfolio
        </a>{" "}
        |{" "}
        <a
          href="mailto:mohammadtarique661998@gmail.com"
          className="text-white hover:text-gray-300"
        >
          Email me
        </a>{" "}
        | <span>Phone: (+91) 8109297598</span>
      </div>
    </footer>
  );
};

export default Footer;
