// pages/dashboard/Overview.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";
import { MdCheckCircleOutline, MdHighlightOff, MdOutlineAccessTime, MdOutlineHome } from "react-icons/md";

import WelcomeCard from "../../../components/dashboard/WelcomeCard";
import StatsGrid from "../../../components/dashboard/StatsGrid";
import RecentListingsCard from "../../../components/dashboard/RecentListingsCard";
import UserProfileDialog from "../../../components/dashboard/UserProfileDialog";

export default function Overview() {
  const { currentUser } = useContext(AuthContext);
  const user = currentUser?.userData ?? {};
  const userId = user?.id;
  const isAdmin = user?.role === "ADMIN";

  const [adminViewAll, setAdminViewAll] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dialogUser, setDialogUser] = useState(null);

  // Fetch posts
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = isAdmin && adminViewAll ? "/posts" : `/posts/user/${userId}`;
        const res = await apiRequest.get(endpoint);
        setPosts(res.data);
        setCurrentPage(1);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId, isAdmin, adminViewAll]);

  const showingAll = isAdmin && adminViewAll;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentPosts = posts.filter((p) => new Date(p.createdAt) >= oneWeekAgo);
  const totalItems = recentPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagedPosts = recentPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stats = [
    { label: showingAll ? "Total Properties" : "Total Listings", value: posts.length, colorKey: "gray", Icon: MdOutlineHome },
    { label: "Available", value: posts.filter((p) => p.status === "available").length, colorKey: "emerald", Icon: MdCheckCircleOutline },
    { label: "Sold", value: posts.filter((p) => p.status === "sold").length, colorKey: "slate", Icon: MdHighlightOff },
    { label: "Rented", value: posts.filter((p) => p.status === "rented").length, colorKey: "amber", Icon: MdOutlineAccessTime },
  ];

  const handlePageChange = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const handlePageSizeChange = (size) => { setPageSize(size); setCurrentPage(1); };
  const openUserDialog = (postUser) => setDialogUser(postUser ?? null);

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {dialogUser && <UserProfileDialog user={dialogUser} onClose={() => setDialogUser(null)} />}

      <WelcomeCard
        user={user}
        isAdmin={isAdmin}
        loading={loading}
        postsCount={posts.length}
        showingAll={showingAll}
        onToggleAdminView={() => setAdminViewAll(v => !v)}
      />

      {isAdmin && (
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border ${showingAll ? "bg-gray-50 text-gray-600 border-gray-100" : "bg-slate-50 text-slate-500 border-slate-100"}`}>
            {showingAll ? <> <MdOutlineHome size={13} /> Platform-wide data </> : <> <MdOutlineHome size={13} /> Your listings only </>}
          </div>
        </div>
      )}

      <StatsGrid stats={stats} loading={loading} showingAll={showingAll} />

      <RecentListingsCard
        loading={loading}
        error={error}
        totalItems={totalItems}
        showingAll={showingAll}
        pagedPosts={pagedPosts}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        openUserDialog={openUserDialog}
      />
    </div>
  );
}