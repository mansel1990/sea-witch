"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <nav className="container mx-auto flex items-center justify-between py-2 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/SeaWitchRed.svg"
            alt="Sea Witch Logo"
            width={36}
            height={36}
            priority
          />
          <span className="font-bold text-lg tracking-tight">Sea Witch</span>
        </Link>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-2">
            <NavigationMenuItem>
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                asChild
              >
                <Link href="/">Home</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                variant={pathname === "/watchlist" ? "secondary" : "ghost"}
                asChild
              >
                <Link href="/watchlist">Watchlist</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                variant={pathname === "/my-reviews" ? "secondary" : "ghost"}
                asChild
              >
                <Link href="/my-reviews">My Reviews</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Log in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback>{user?.firstName?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <UserButton afterSignOutUrl="/" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default Header;
