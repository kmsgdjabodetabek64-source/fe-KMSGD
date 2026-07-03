import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-neutral-950">
            <AdminSidebar />
            <main className="flex-1 p-3 md:p-10 overflow-auto md:ml-60">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;