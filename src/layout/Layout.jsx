import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/navbar/Navbar";
import Sidebar from "../components/shared/sidebar/Sidebar";
import Footer from "../components/shared/footer/Footer";
import { CloseSvg } from "../utils/svgs";

function Layout() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="bg-themeMid h-screen w-full overflow-hidden">
      <div className="flex h-full">
        <div className="h-full relative">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          {/* Mobile Overlay */}
          {showSidebar && <div className="block xl:hidden w-full h-full fixed bg-black/75 top-0 left-0 z-[55]" onClick={() => setShowSidebar(false)}>
            <CloseSvg w="42" h="42" color="#fff" cls={"fixed top-5 right-5 cursor-pointer z-50"} />
          </div>}
        </div>

        <div className="flex flex-col h-full flex-1 overflow-hidden">
          <Navbar toggleSidebar={setShowSidebar} />

          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
