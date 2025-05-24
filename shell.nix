{ pkgs ? import <nixpkgs> {} }:
let
  nodejs = pkgs.nodejs_20;
in
pkgs.mkShell {
  buildInputs = [
    nodejs
    pkgs.yarn
    pkgs.nodePackages.http-server
    pkgs.nodePackages.concurrently
  ];
  shellHook = ''echo "Entering development shell with Node.js ${nodejs.version}, Yarn, concurrently, and http-server"'';
}