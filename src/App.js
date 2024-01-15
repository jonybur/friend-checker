import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";

function App() {
  const [followersData, setFollowersData] = useState(null);
  const [followingData, setFollowingData] = useState(null);
  // const [whitelistData, setWhitelistData] = useState(null);
  const [results, setResults] = useState({
    notFollowingBack: [],
    theyDontFollowMeBack: [],
  });

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
      // && !whitelistData.includes(username)
    );
    const theyDontFollowMeBack = followingUsernames.filter(
      (username) => !followersUsernames.includes(username)
      // && !whitelistData.includes(username)
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

      {/* Carousel for Images */}
      <div className="carousel-container">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <img
            key={num}
            src={`./screenshots/${num}.png`}
            alt={`Screenshot ${num}`}
          />
        ))}
      </div>

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
          <h3>You Are Not Following Back:</h3>
          <ul>
            {results.notFollowingBack.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
        <div className="result">
          <h3>They Are Not Following You Back:</h3>
          <ul>
            {results.theyDontFollowMeBack.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
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
