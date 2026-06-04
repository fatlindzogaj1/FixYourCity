import { Link } from "@inertiajs/react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { dashboard, home, login, logout, register } from "@/routes";
import type { User } from "@/types";

type Props = {
  user?: User | null;
};

const Navbar = ({ user = null }: Props) => {
  const isAdmin = user?.role === "admin";

  const links = [
    ...(isAdmin ? [{ title: "Dashboard", href: dashboard() }] : []),
    { title: "Reports", href: home() },
  ];

  return (
    <nav className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href={home()} className="text-lg font-semibold">
            FixYourCity
          </Link>

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              {links.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.href}>{item.title}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <Button
              variant="outline"
              asChild
              className="hidden sm:inline-flex"
            >
              <Link href={logout()} method="post" as="button">
                Logout
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href={login()}>Login</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href={register()}>Register</Link>
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="md:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="px-6 py-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-6 flex flex-col gap-2">
                {links.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "justify-start"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
                {user ? (
                  <Button variant="outline" asChild>
                    <Link href={logout()} method="post" as="button">
                      Logout
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href={login()}>Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href={register()}>Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
