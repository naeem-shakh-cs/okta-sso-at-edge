import { Disclosure } from "@headlessui/react";
import DarkThemeButton from "./DarkThemeButton";
import { Link } from "@remix-run/react";

export default function Navbar() {
  return (
    <>
      <Disclosure as="header">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-screen-xl px-6 dark:text-white">
              <div className="flex justify-between items-center py-4">
                <div>
                  <Link to="https://www.contentstack.com/platforms/headless-cms" target="_blank" className="text-3xl font-bold">
                    <img src="cs_logo.png" width="30"/>
                  </Link>
                </div>
                <div className="sm:flex space-x-8 items-center">
                  <nav className="flex justify-center space-x-10 py-4">
                  </nav>
                  <DarkThemeButton />
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
}
