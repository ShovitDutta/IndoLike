import { auth } from "./auth";
import { NextResponse } from "next/server";
export default auth(async req => {
  const session = await auth();
  if (session) {
    const user = session.user;
    if (user && user.apiKey) return NextResponse.next();
    else return NextResponse.redirect(new URL("/gApi", req.url));
  }
  return NextResponse.next();
});
export const config = { matcher: ["/chat"] };
