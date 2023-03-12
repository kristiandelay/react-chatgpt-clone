import React from "react";
import { useNavigate } from "react-router-dom";

import "./HomePage.css";
import "../BackgroundParticles/BackgroundParticles.css";
import BackgroundParticles from "../BackgroundParticles";

const HomePage = () => {
  const navigate = useNavigate();

  

  return (
    <div className="home-page">
      <BackgroundParticles />
      <h1>Welcome to ChatGPT Clone</h1>
      <p>
        Our state-of-the-art platform is designed to provide you with an
        unparalleled chatbot experience. Using cutting-edge technologies such as
        React, Express, and the powerful ChatGPT API, we have created a
        revolutionary clone of the original ChatGPT.
      </p>
      <p>
        With our platform, you can enjoy all the features of the original
        ChatGPT and more. Our team of expert developers has gone above and
        beyond to ensure that our clone is not only easy to use but also fully
        customizable to meet your specific needs. Whether you're a business
        owner looking to enhance customer support or an individual searching for
        a fun and interactive way to communicate, ChatGPT Clone has got you
        covered.
      </p>
      <p>
        Please note that in order to use our platform, you will need to have
        your own ChatGPT API. But don't worry - our user-friendly interface
        makes it simple and straightforward to integrate your API and get
        started right away.
      </p>
      <button className="home-page-button" onClick={() => {
        navigate(`/chat/`);
      }}>
        That was all bullshit and this entire app was written with chatGPT. =)
      </button>
    </div>
  );
};

export default HomePage;
