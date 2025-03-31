import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";

function App() {
  const [followersData, setFollowersData] = useState(null);
  const [followingData, setFollowingData] = useState(null);
  const [hideNotFollowing, setHideNotFollowing] = useState(false);
  const [hideWhitelisted, setHideWhitelisted] = useState(false);
  const [expandedLists, setExpandedLists] = useState({
    notFollowingBack: true,
    theyDontFollowMeBack: true
  });
  const [whitelistedUsers, setWhitelistedUsers] = useState(() => {
    const saved = localStorage.getItem('whitelistedUsers');
    return saved ? JSON.parse(saved) : [];
  });
  const [results, setResults] = useState({
    notFollowingBack: [],
    theyDontFollowMeBack: [],
  });

  useEffect(() => {
    localStorage.setItem('whitelistedUsers', JSON.stringify(whitelistedUsers));
  }, [whitelistedUsers]);

  const toggleWhitelist = (username) => {
    setWhitelistedUsers(prev => {
      if (prev.includes(username)) {
        return prev.filter(user => user !== username);
      } else {
        return [...prev, username];
      }
    });
  };

  const handleFileChange = (event, setter) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setter(JSON.parse(e.target.result));
      };
      reader.readAsText(file);
    }
  };

  const processFiles = () => {
    if (!followersData || !followingData) {
      alert("Please upload all the required files.");
      return;
    }

    const extractUsernames = (data) => {
      console.log({ data });
      return data
        .filter(
          (item) =>
            Array.isArray(item.string_list_data) &&
            item.string_list_data.length > 0
        )
        .map((item) => item.string_list_data[0].value);
    };

    const followersUsernames = extractUsernames(followersData);
    const followingUsernames = extractUsernames(
      followingData.relationships_following
    );

    const notFollowingBack = followersUsernames.filter(
      (username) => !followingUsernames.includes(username)
    );
    const theyDontFollowMeBack = followingUsernames.filter(
      (username) => !followersUsernames.includes(username)
    );

    setResults({
      notFollowingBack: notFollowingBack,
      theyDontFollowMeBack: theyDontFollowMeBack,
    });
  };

  const showInstructionCarousel = () => {
    toast(
      <div className="carousel-container">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <img
            key={num}
            src={`./screenshots/${num}.png`}
            alt={`Instruction ${num}`}
          />
        ))}
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <div className="App">
      <ToastContainer />

      {/* File Input Section */}
      <div className="file-input-section">
        <div className="file-input">
          <label>followers_1.json:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setFollowersData)}
            accept=".json"
          />
        </div>
        <div className="file-input">
          <label>following.json:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setFollowingData)}
            accept=".json"
          />
        </div>
        <button className="process-button" onClick={processFiles}>
          Process Files
        </button>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <h2>Results:</h2>
        <div className="result">
          <div className="list-header" onClick={() => setExpandedLists(prev => ({ ...prev, notFollowingBack: !prev.notFollowingBack }))}>
            <h3>You Are Not Following Back:</h3>
            <span className="toggle-icon">{expandedLists.notFollowingBack ? '▼' : '▶'}</span>
          </div>
          {expandedLists.notFollowingBack && (
            <ul>
              {results.notFollowingBack
                .filter(user => !hideWhitelisted || !whitelistedUsers.includes(user))
                .length > 0 ? (
                results.notFollowingBack
                  .filter(user => !hideWhitelisted || !whitelistedUsers.includes(user))
                  .map((user, index) => (
                    <li key={index}>
                      <label className="user-item">
                        <input
                          type="checkbox"
                          checked={whitelistedUsers.includes(user)}
                          onChange={() => toggleWhitelist(user)}
                        />
                        <span>{user}</span>
                      </label>
                    </li>
                  ))
              ) : (
                <li className="empty-message">No users for this list</li>
              )}
            </ul>
          )}
        </div>
        <div className="result">
          <div className="list-header" onClick={() => setExpandedLists(prev => ({ ...prev, theyDontFollowMeBack: !prev.theyDontFollowMeBack }))}>
            <h3>They Are Not Following You Back:</h3>
            <span className="toggle-icon">{expandedLists.theyDontFollowMeBack ? '▼' : '▶'}</span>
          </div>
          {expandedLists.theyDontFollowMeBack && (
            <>
              <div className="filter-toggles">
                <label>
                  <input
                    type="checkbox"
                    checked={hideNotFollowing}
                    onChange={(e) => setHideNotFollowing(e.target.checked)}
                  />
                  Hide users I don't follow
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={hideWhitelisted}
                    onChange={(e) => setHideWhitelisted(e.target.checked)}
                  />
                  Hide whitelisted users
                </label>
              </div>
              <ul>
                {results.theyDontFollowMeBack
                  .filter(user =>
                    (!hideNotFollowing || results.notFollowingBack.includes(user)) &&
                    (!hideWhitelisted || !whitelistedUsers.includes(user))
                  )
                  .length > 0 ? (
                  results.theyDontFollowMeBack
                    .filter(user =>
                      (!hideNotFollowing || results.notFollowingBack.includes(user)) &&
                      (!hideWhitelisted || !whitelistedUsers.includes(user))
                    )
                    .map((user, index) => (
                      <li key={index}>
                        <label className="user-item">
                          <input
                            type="checkbox"
                            checked={whitelistedUsers.includes(user)}
                            onChange={() => toggleWhitelist(user)}
                          />
                          <span>{user}</span>
                        </label>
                      </li>
                    ))
                ) : (
                  <li className="empty-message">No users for this list</li>
                )}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Button to Show Toast Notification */}
      <div>
        <button onClick={showInstructionCarousel}>
          How to Get Required Files
        </button>
      </div>
    </div>
  );
}

export default App;
