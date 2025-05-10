import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-5 backdrop-blur-3xl mt-8 px-6 md:px-20 lg:px-32">
      <div>
        <h1 className="text-xl font-bold">
          Audio<span className="text-primary">Sphere</span>
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Made with ♥ by{" "}
        <a className="underline text-primary hover:text-primary" href="https://github.com/ShovitDutta">
          Shovit Dutta
        </a>
      </p>
    </footer>
  );
}
