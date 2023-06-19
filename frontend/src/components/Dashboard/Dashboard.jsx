import React from "react";
import NavMenu from "./NavMenu/NavMenu";
import NavBar from "./NavBar/NavBar";

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-row">
        <NavMenu />
        <div className="w-screen">
          <NavBar />
          <div class="p-4 m-0">
            <p>
              <b>Content Here</b>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
