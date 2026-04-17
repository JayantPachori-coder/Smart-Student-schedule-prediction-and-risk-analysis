import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewSchedule.css";

const ViewSchedule = () => {
  const [groupedSchedule, setGroupedSchedule] = useState({});

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://smart-backend-2zlf.onrender.com/api/schedule/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const grouped = {};

        res.data.forEach((item) => {
          const date = new Date(item.createdAt).toLocaleDateString();

          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(item);
        });

        setGroupedSchedule(grouped);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="view-container">
      <div className="view-content">

        <div className="page-header">
          <h1>📅 My Saved Schedule</h1>
        </div>

        {Object.keys(groupedSchedule).length === 0 && (
          <p>No schedules found</p>
        )}

        {Object.entries(groupedSchedule).map(([date, items], idx) => (
          <div key={idx} className="schedule-block">

            <h2 className="date-title">{date}</h2>

            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Hours</th>
                  <th>Time Block</th>
                  <th>Created Time</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, i) =>
                  item.subjects?.map((sub, j) =>
                    sub.blockHours?.map((b, k) => (
                      <tr key={`${i}-${j}-${k}`}>
                        <td>{sub.name}</td>
                        <td>{sub.predictedHours}</td>
                        <td>{b.timeBlock}</td>
                        <td>
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>

            </table>

          </div>
        ))}

      </div>
    </div>
  );
};

export default ViewSchedule;
