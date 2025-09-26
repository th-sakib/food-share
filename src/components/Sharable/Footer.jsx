import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <div className="bg-gray-900 mt-12 text-white">
      <div className="max-w-7xl mx-auto px-6 pb-12 pt-6">
        {/* Top section: 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand / Mission */}
          <div>
            <h2 className="text-2xl font-bold flex gap-2">
              <span role="img" aria-label="food">
                🍲
              </span>{" "}
              FoodShare
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Helping communities reduce food waste and share surplus meals with
              those in need. Together, we can make a difference.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Share Food
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Find Food
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Community
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Our Partners
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Volunteer
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-green-700 dark:hover:text-green-400"
                >
                  Donate
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

        {/* Bottom section: social + copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="hover:text-green-700 dark:hover:text-green-400"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:text-green-700 dark:hover:text-green-400"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:text-green-700 dark:hover:text-green-400"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:text-green-700 dark:hover:text-green-400"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} FoodShare. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
