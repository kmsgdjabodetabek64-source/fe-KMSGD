import { Outlet } from "react-router-dom";
import NavbarKepengurusan from "./components/NavbarKepengurusan";

const Kepengurusan = () => {
    return (
        <main className="flex-1">
            <div className="mb-8 border-b border-[#b8982a] pb-4">
                <h1 className="text-[1.75rem] font-bold text-[#ffd700] m-0">
                    Kepengurusan
                </h1>
                <p className="text-neutral-400 mt-1 m-0 text-[0.9rem]">
                    Kelola data periode kepengurusan, departemen, dan pengurus.
                </p>
            </div>

            <NavbarKepengurusan />

            <div className="mt-8">
                <Outlet />
            </div>
        </main>
    )
}

export default Kepengurusan;