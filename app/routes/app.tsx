import { Outlet } from "@remix-run/react";

const AppIndex = () => {
  return (
    <div>
      AppIndex
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AppIndex;
