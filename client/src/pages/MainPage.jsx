import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();
  const [confessions, setConfessions] = useState([]); // State to hold the confessions data
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search input
  const [filteredConfessions, setFilteredConfessions] = useState([]); // State to hold filtered results

  useEffect(() => {
    const checkAuth = async () => {
      try {
        axios.defaults.withCredentials = true;

        const response = await axios.get("http://localhost:5000/protected", {
          withCredentials: true, // Include cookies in the request
        });
        console.log(response.data); // Log authenticated user data
      } catch (err) {
        console.error(err.response?.data?.message || "Unauthorized");
        navigate("/"); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/confessions");
        setConfessions(response.data); // Store the confessions data in state
        setFilteredConfessions(response.data); // Initialize filtered results
      } catch (err) {
        console.error("Error fetching confessions:", err);
      }
    };

    fetchConfessions();
  }, []);

  // Update filtered confessions based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredConfessions(confessions); // Show all confessions if search is empty
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = confessions.filter((confession) =>
        confession.recipient.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredConfessions(filtered);
    }
  }, [searchQuery, confessions]);

  return (
    <div>
      <div className="border-b-[1px] border-gray-300 p-6 flex justify-between">
        <h1 className="reenie-beanie-regular text-4xl">confessit!</h1>
        <div className="inline-flex">
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
            className="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Browse someone..."
            required
          />
          <Link
            to="/submit"
            className="inline-flex items-center py-2 px-3 ms-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Submit&nbsp;Your&nbsp;Confession
          </Link>
        </div>
      </div>
      <div className="reenie-beanie-regular text-4xl max-w-[40rem] m-auto mt-8">
        Confession Wall
      </div>
      <div className="max-w-[40rem] mt-6 m-auto gap-4 grid grid-cols-2">
        {filteredConfessions.length > 0 ? (
          filteredConfessions.map((confession) => (
            <Link
              to={`/decryption/${confession._id}`}
              key={confession._id}
              className="h-52 shadow border-gray-600 p-5 rounded-xl hover:bg-gray-950/[.05] transition-colors duration-200"
            >
              <div className="flex justify-between gap-2 text-sm font-medium text-gray-800">
                <div>
                  <span className="text-gray-500">to:</span>{" "}
                  {confession.recipient}
                </div>
                <div>
                  <span className="text-gray-500">clue:</span> {confession.clue}
                </div>
              </div>
              <div className="mt-3 mb-1 text-sm text-gray-500 font-medium">
                encrypted message:
              </div>
              <div className="relative w-full">
                <div className="italic underline text-gray-800">
                  <div className="overflow-hidden">
                    <div className="line-clamp-3 break-words whitespace-pre-line font-geist">
                      {confession.confession}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No confessions match your search.</p>
        )}
      </div>
      <div className="reenie-beanie-regular text-4xl  border-t-[1px] mt-10 border-gray-300 p-6 flex justify-end">
        <h1>confessit!</h1>
      </div>
    </div>
  );
}
