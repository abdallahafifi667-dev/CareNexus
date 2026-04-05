import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Search as SearchIcon,
  Filter,
  MapPin,
  Star,
  DollarSign,
  User,
  Shield,
  Loader2,
  ChevronDown,
  X,
  Stethoscope,
  UserPlus,
  Clock,
  Navigation,
} from "lucide-react";
import { toast } from "react-hot-toast";
import searchApi from "../../../utils/searchApi";
import socialApi from "../../../utils/socialApi";
import "./AdvancedSearchPage.scss";

const AdvancedSearchPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const query = searchParams.get("q") || "";
  const roleFilter = searchParams.get("role") || (currentUser?.role === 'patient' ? 'doctor' : '');
  const specFilter = searchParams.get("specialization") || "";
  const ratingFilter = searchParams.get("minRating") || "";
  const sortFilter = searchParams.get("sortBy") || "relevance";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(new Set());

  // Filters State
  const [tempFilters, setTempFilters] = useState({
    role: roleFilter || (currentUser?.role === 'patient' ? 'doctor' : ''),
    specialization: specFilter,
    minRating: ratingFilter,
    sortBy: sortFilter,
  });

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  useEffect(() => {
    // Reset when query or filters change
    setResults([]);
    setPage(1);
    setHasMore(true);
    handleSearch(1, true);

    // Track search
    searchApi.trackSearch(query, { role: roleFilter, specialization: specFilter });
  }, [query, roleFilter, specFilter, ratingFilter, sortFilter]);

  useEffect(() => {
    if (page > 1) {
      handleSearch(page, false);
    }
  }, [page]);

  const handleSearch = async (pageNum, isInitial) => {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = {
        q: query,
        role: roleFilter,
        specialization: specFilter,
        minRating: ratingFilter,
        sortBy: sortFilter,
        page: pageNum,
        limit: 10,
      };

      const response = await searchApi.advancedSearch(params);
      const newResults = response.data.data;

      setResults((prev) => (isInitial ? newResults : [...prev, ...newResults]));
      setTotal(response.data.pagination.total);
      setHasMore(pageNum < response.data.pagination.totalPages);
    } catch (error) {
      toast.error(t("errors.search_failed", "Search failed. Please try again."));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(tempFilters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setTempFilters({
      role: "",
      specialization: "",
      minRating: "",
      sortBy: "relevance",
    });
    setSearchParams({ q: query });
    setShowFilters(false);
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

  const renderRatingStars = (rating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= Math.round(rating) ? "#ffc107" : "none"}
            color={star <= Math.round(rating) ? "#ffc107" : "#e4e5e9"}
          />
        ))}
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="advanced-search-page">
      <div className="search-controls">
        <div className="search-info">
          <h1>{query ? t("social.search_results", { query }) : t("common.search", "Search")}</h1>
          <p>{total} {t("common.results_found", "results found")}</p>
        </div>
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          {t("common.filters", "Filters")}
        </button>
      </div>

      {showFilters && (
        <div className="filters-overlay">
          <div className="filters-card">
            <div className="filters-header">
              <h3>{t("common.search_filters", "Search Filters")}</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>

            <div className="filters-body">
              <div className="filter-group">
                <label>{t("auth.role", "Role")}</label>
                <select
                  value={tempFilters.role}
                  onChange={(e) => setTempFilters({ ...tempFilters, role: e.target.value })}
                >
                  <option value="">{t("common.all", "All")}</option>
                  <option value="doctor">{t("auth.role_doctor")}</option>
                  <option value="nursing">{t("auth.role_nursing")}</option>
                  <option value="patient">{t("auth.role_patient")}</option>
                </select>
              </div>

              <div className="filter-group">
                <label>{t("common.specialization", "Specialization")}</label>
                <input
                  type="text"
                  placeholder={t("common.search_spec", "e.g. Cardiology")}
                  value={tempFilters.specialization}
                  onChange={(e) => setTempFilters({ ...tempFilters, specialization: e.target.value })}
                />
              </div>

              <div className="filter-group">
                <label>{t("common.min_rating", "Min Rating")}</label>
                <div className="rating-options">
                  {[4, 3, 2, 1].map(num => (
                    <button
                      key={num}
                      className={tempFilters.minRating === String(num) ? 'active' : ''}
                      onClick={() => setTempFilters({ ...tempFilters, minRating: String(num) })}
                    >
                      {num}+ <Star size={14} fill="#ffc107" color="#ffc107" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>{t("common.sort_by", "Sort By")}</label>
                <select
                  value={tempFilters.sortBy}
                  onChange={(e) => setTempFilters({ ...tempFilters, sortBy: e.target.value })}
                >
                  <option value="relevance">{t("common.relevance", "Relevance")}</option>
                  <option value="rating">{t("common.top_rated", "Top Rated")}</option>
                  <option value="distance">{t("common.nearest", "Nearest")}</option>
                </select>
              </div>
            </div>

            <div className="filters-footer">
              <button className="btn-reset" onClick={resetFilters}>{t("common.reset", "Reset")}</button>
              <button className="btn-apply" onClick={applyFilters}>{t("common.apply", "Apply Filters")}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={48} color="#2563eb" />
          <p>{t("common.searching", "Searching...")}</p>
        </div>
      ) : results.length > 0 ? (
        <div className="results-container">
          <div className="results-grid">
            {results.map((user, index) => {
              const userId = user.id || user._id;
              const isLast = index === results.length - 1;

              return (
                <div
                  key={userId}
                  className={`user-result-card ${user.isPremium ? 'premium' : ''}`}
                  ref={isLast ? lastElementRef : null}
                  onClick={() => navigate(`/${currentUser.role}/profile/${userId}`)}
                >
                  {user.isPremium && <div className="premium-badge"><Shield size={12} /> Premium</div>}

                  <div className="card-top">
                    <div className="avatar-wrapper">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          <User size={32} />
                        </div>
                      )}
                    </div>
                    <div className="user-main-info">
                      <h3>{user.username}</h3>
                      <span className={`role-tag ${user.role}`}>
                        {user.role === 'doctor' && <Stethoscope size={14} />}
                        {t(`auth.role_${user.role}`)}
                      </span>
                      {renderRatingStars(user.avgRating || 0)}
                    </div>
                  </div>

                  <div className="card-details">
                    {user.academicDegrees?.[0] && (
                      <p className="specialization">
                        <strong>{user.academicDegrees[0].degree}:</strong> {user.academicDegrees[0].field}
                      </p>
                    )}
                    <p className="location">
                      <MapPin size={14} /> {user.address || t("common.location_not_set", "Location not set")}
                      {user.distance && <span className="distance-km">({user.distance.toFixed(1)} km)</span>}
                    </p>
                  </div>

                  <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                    {pendingRequests.has(userId) ? (
                      <button className="btn-pending" disabled>
                        <Clock size={16} />
                        {t("social.pending")}
                      </button>
                    ) : (
                      <button
                        className="btn-action"
                        onClick={() => sendRequest(userId)}
                      >
                        <UserPlus size={16} />
                        {t("social.add_friend")}
                      </button>
                    )}
                    <button className="btn-secondary" onClick={() => navigate(`/${currentUser.role}/chat?userId=${userId}`)}>
                      {t("common.message", "Message")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {loadingMore && (
            <div className="load-more-spinner">
              <Loader2 className="animate-spin" size={24} />
            </div>
          )}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">
            <SearchIcon size={80} strokeWidth={1} />
          </div>
          <h3>{t("social.no_results")}</h3>
          <p>{t("social.try_different_query", "Try adjusting your search terms or filters.")}</p>
          <button className="btn-clear" onClick={resetFilters}>{t("common.clear_all", "Clear All Filters")}</button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchPage;
