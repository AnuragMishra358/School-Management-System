import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseApi } from "../../../environment";

export const NoticeTeacher = () => {
  const [notices, setNotices] = useState([]);
  const fetchAllNotices = async () => {
    try {
      const resp = await axios.get(`${baseApi}/notice/all`);
      // console.log(resp);
      const allNotices = resp.data.data;
      const filteredNotices = allNotices.filter(
        (x) => x.audience === "Teacher"
      );
      setNotices(filteredNotices);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllNotices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-cyan-500 dark:bg-gray-900 p-6">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-8 tracking-wide">
        Notice Board
      </h1>

      {/* Notices List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {notices &&
          notices.map((x) => (
            <div
              key={x._id}
              className="bg-gray-200 dark:bg-gray-800 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/30 
                 hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300"
            >
              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold dark:text-gray-200 mb-2 truncate">
                Title: {x.title}
              </h2>

              {/* Message */}
              <p className="text-sm sm:text-base dark:text-gray-300 mb-4 line-clamp-3">
                Message: {x.message}
              </p>

              {/* Footer */}
              <div className="flex flex-col text-xs sm:text-sm border-t border-black/30 dark:border-gray-600 pt-3 space-y-1">
                <span className="flex items-center gap-1 dark:text-gray-300">
                  Audience: <span className="font-medium">{x.audience}</span>
                </span>
                <span className="flex items-center gap-1 dark:text-gray-300">
                  PostedOn:{" "}
                  <span className="font-medium">
                    {new Date(x.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
