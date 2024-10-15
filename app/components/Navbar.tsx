import { Disclosure } from "@headlessui/react";
import { Link } from "@remix-run/react";

export default function Navbar() {
  return (
    <>
      <Disclosure as="header">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-screen-xl px-6 dark:text-white green:text-white">
              <div className="flex justify-between items-center py-4">
                <div>
                </div>
                <div className="sm:flex space-x-8 items-center">
                  <nav className="flex justify-center space-x-10 py-4">
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
}
