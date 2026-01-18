"use client";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell, Home, ShoppingCart } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useSearchParams } from "next/navigation";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import ProfileButton from "./ProfileButton";

const Navbar = () => {
 const searchParams = useSearchParams();
 const activeCategory = searchParams.get("category");

  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
      {/* LEFT */}
      {/* LEFT */}
<div className="flex items-center gap-8">
  <Link href="/" className="flex items-center">
    <Image
      src="/logo.png"
      alt="Instyle"
      width={36}
      height={36}
      className="w-6 h-6 md:w-9 md:h-9"
    />
    <p className="hidden md:block text-md font-medium tracking-wider">
      INSTYLE
    </p>
  </Link>

  {/* CATEGORIES */}
  <div className="hidden md:flex items-center gap-5 text-sm">
    <Link
      href="/products"
      className={!activeCategory ? "font-semibold underline" : "text-gray-600"}
    >
      All
    </Link>

    <Link
      href="/products?category=tops"
      className={activeCategory === "tops" ? "font-semibold underline" : "text-gray-600"}
    >
      Tops
    </Link>

    <Link
      href="/products?category=shoes"
      className={activeCategory === "shoes" ? "font-semibold underline" : "text-gray-600"}
    >
      Shoes
    </Link>

    <Link
      href="/products?category=accessories"
      className={activeCategory === "accessories" ? "font-semibold underline" : "text-gray-600"}
    >
      Accessories
    </Link>

    <Link
      href="/products?category=bags"
      className={activeCategory === "bags" ? "font-semibold underline" : "text-gray-600"}
    >
      Bags
    </Link>

    <Link
      href="/products?category=dresses"
      className={activeCategory === "dresses" ? "font-semibold underline" : "text-gray-600"}
    >
      Dresses
    </Link>
  </div>
</div>


      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href="/">
          <Home className="w-4 h-4 text-gray-600" />
        </Link>
        <Bell className="w-4 h-4 text-gray-600" />
        <ShoppingCartIcon />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <ProfileButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
