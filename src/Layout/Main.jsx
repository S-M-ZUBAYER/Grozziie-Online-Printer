import TopNavbar from "../Share/Navbar/TopNavbar";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <TopNavbar />
      <Outlet />
    </div>
  );
};

export default Main;
