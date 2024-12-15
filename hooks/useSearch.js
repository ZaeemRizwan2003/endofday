import { useState, useEffect } from "react";
import axios from "axios";

const useSearch = () => {
  const [results, setResults] = useState({ restaurants: [], listings: [] });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeOption, setActiveOption] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/Customer/restaurants", {
        params: { type: activeOption, search ,page, limit: 10},
      });

      setResults(res.data.data || { restaurants: [], listings: [] });
      setTotalPages(
        Math.ceil(
          res.data.meta.totalRestaurants / 10
        ) // Assuming 10 items per page
      );
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults({ restaurants: [], listings: [] }); // Reset results on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [activeOption, search, page]);

  return {  
    results,
    loading,
    search,
    setSearch,
    activeOption,
    setActiveOption,
    page,
    setPage,
    totalPages,
  };
};

export default useSearch;
