{ pkgs ? import <nixpkgs> {} }:

let
  nodejs = pkgs.nodejs_20; # Use Node.js version 20
in
pkgs.mkShell {
  buildInputs = [
    nodejs
    pkgs.yarn
    pkgs.nodePackages.concurrently
    pkgs.nodePackages.http-server
  ];

  shellHook = ''
    echo "Entering development shell with Node.js ${nodejs.version}, Yarn, concurrently, and http-server"
  '';
}
