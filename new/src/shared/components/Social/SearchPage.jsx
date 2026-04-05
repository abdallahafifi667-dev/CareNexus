import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserPlus,
  UserCheck,
  Clock,
  Search as SearchIcon,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import socialApi from "../../../utils/socialApi";
import "./SearchPage.scss";

const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(new Set());

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await socialApi.searchUsers(query);
      setResults(response.data.data);
    } catch (error) {
      toast.error(t("errors.action_failed"));
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (userId) => {
    try {
      await socialApi.sendFriendRequest(userId);
      setPendingRequests((prev) => new Set(prev).add(userId));
      toast.success(t("social.request_sent"));
    } catch (error) {
      toast.error(error.response?.data?.message || t("errors.action_failed"));
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>{t("social.search_results", { query })}</h1>
        <p>
          {results.length} {t("common.results_found", "results found")}
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : results.length > 0 ? (
        <div className="results-grid">
          {results.map((user) => {
            const userId = user.id || user._id;
            return (
            <div key={userId} className="user-card">
              <div className="user-avatar text-white">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-details">
                <h3>{user.username}</h3>
                <span className="status-badge">
                  {t(`auth.role_${user.role}`)}
                </span>
                <p className="phone">{user.phone}</p>
              </div>
              <div className="card-actions">
                {pendingRequests.has(userId) ? (
                  <button className="btn-pending" disabled>
                    <Clock size={18} />
                    {t("social.pending")}
                  </button>
                ) : (
                  <button
                    className="btn-add"
                    onClick={() => sendRequest(userId)}
                  >
                    <UserPlus size={18} />
                    {t("social.add_friend")}
                  </button>
                )}
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div className="no-results">
          <SearchIcon size={64} opacity={0.3} />
          <h3>{t("social.no_results")}</h3>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
