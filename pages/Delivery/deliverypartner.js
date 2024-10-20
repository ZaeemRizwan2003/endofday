"use client";
import React, { useState } from "react";
import DeliveryLogin from "@/Components/DeliveryLogin";
import DeliverySignUp from "@/Components/DeliverySignUp";

const page = () => {
  const [login, setlogin] = useState(true);

  return (
    <>
      <div className="container">
        <h1 style={{ textAlign: "center" }}></h1>
        {login ? <DeliveryLogin /> : <DeliverySignUp />}
        <div>
          <button
            className="text-purple-800 hover:text-purple-600 font-semibold underline transition-colors duration-300 mt-3"
            onClick={() => setlogin(!login)}
          >
            {!login ? "Already Have Account? Login" : "New User? Signup"}
          </button>
        </div>
      </div>
    </>
  );
};

export default page;
