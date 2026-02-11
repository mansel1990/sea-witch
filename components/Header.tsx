"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { authClient } from "@/lib/auth-client";
import SearchBar from "./SearchBar";
import { Search as SearchIcon } from "lucide-react";
import { useAddUser } from "../lib/hooks/useAddUser";
import { useGlobalStore } from "@/lib/store";

export function Header() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { mutate: addUser } = useAddUser();
  const setUserId = useGlobalStore((state) => state.setUserId);

  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      const localKey = `user_registered_${user.id}`;
      if (!localStorage.getItem(localKey)) {
        setUserId(user.id);
        const payload = {
          userId: user.id,
          email: user.email || "",
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          imageUrl: user.image || "",
          username: user.name || "",
        };
        addUser(payload, {
          onSuccess: () => {
            localStorage.setItem(localKey, "true");
          },
        });
      } else {
        setUserId(user.id);
      }
    }
  }, [session, addUser, setUserId]);

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "/my-reviews", label: "My Reviews" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/sea-witch.png"
            alt="Sea Witch Logo"
            width={40}
            height={40}
            priority
            className="filter"
          />
          <span className="font-bold text-xl tracking-tight text-white">
            Sea Witch
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-1">
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  asChild
                  className={`${
                    pathname === item.href
                      ? "bg-white text-black hover:bg-gray-200"
                      : "text-white hover:bg-gray-800 hover:text-white"
                  } font-medium`}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          {/* Search Icon - mobile only */}
          <Link href="/search" className="block lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
          </Link>
          {/* Search Bar - Hidden on mobile to save space */}
          <div className="hidden lg:block">
            <SearchBar />
          </div>

          {!session ? (
            <Button
              variant="default"
              className="bg-red-600 hover:bg-red-700 text-white font-medium"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-gray-600 hover:border-white transition-colors">
                  <AvatarImage
                    src={session.user.image || undefined}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {session.user.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 bg-gray-900 border-gray-700"
              >
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-6 py-4">
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <SearchBar />
            </div>

            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "default" : "ghost"}
                  asChild
                  className={`justify-start font-medium ${
                    pathname === item.href
                      ? "bg-white text-black hover:bg-gray-200"
                      : "text-white hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
