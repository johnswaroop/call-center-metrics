import { Bell, Mic, User } from "lucide-react";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href={"/"} className="flex-shrink-0 flex items-center">
              <Mic className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="ml-2 text-2xl font-bold text-primary">
                SupportAI
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-primary text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              {/* <Link
                href="#"
                className="border-transparent text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <FileAudio className="mr-2 h-4 w-4" />
                Transcriptions
              </Link>
              <Link
                href="#"
                className="border-transparent text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Projects
              </Link> */}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              type="button"
              className="bg-background p-1 rounded-full text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="bg-background flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <User className="h-8 w-8 rounded-full" />
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="bg-background inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="#"
            className="bg-accent border-primary text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="border-transparent text-muted-foreground hover:bg-accent hover:border-primary hover:text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Transcriptions
          </Link>
          <Link
            href="#"
            className="border-transparent text-muted-foreground hover:bg-accent hover:border-primary hover:text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Projects
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-accent">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <User className="h-10 w-10 rounded-full" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-primary">Tom Cook</div>
              <div className="text-sm font-medium text-muted-foreground">
                tom@example.com
              </div>
            </div>
            <button
              type="button"
              className="ml-auto bg-background flex-shrink-0 p-1 rounded-full text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              href="#"
              className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
            >
              Your Profile
            </Link>
            <Link
              href="#"
              className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
            >
              Settings
            </Link>
            <Link
              href="#"
              className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
            >
              Sign out
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
