import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [user, setuser] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [errorList, setErrorList] = useState([]);
  const [isLoading, setISLoading] = useState(false);
  function getUserData(eventinfo) {
    let myUser = { ...user };
    myUser[eventinfo.target.name] = eventinfo.target.value;

    setuser(myUser);
  }

  async function sedDataToApi() {
    try {
      let { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        user
      );
          if (data.message == "success") {
        setISLoading(false);
        navigate("/login");
      } else {
        setISLoading(false);
      }
    } catch (error) {
      if (error.response.data.message) {
        setError(error.response.data.message)
      }
      if (error.response.data.errors.msg) {
        setError(error.response.data.errors.msg);
      }
    }
  
  }

  function submit(e) {
    setISLoading(true);
    e.preventDefault();
    let validation = validateRegisterForm();
    if (validation.error) {
      setISLoading(false);
      setErrorList(validation.error.details);
    } else {
      setError("");
      setErrorList([]);
      sedDataToApi();
    }
  }

  function validateRegisterForm() {
    let scheme = Joi.object({
      name: Joi.string().min(3).max(10).required(),
      phone: Joi.number().required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] }
      }),

      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      rePassword: Joi.string().valid(Joi.ref("password")).required()
    });
    return scheme.validate(user, { abortEarly: false });
  }

  return (
    <>
      {errorList.map((err, index) => {
        if (err.context.label === "password") {
          return (
            <div key={index} className="alert alert-danger">
              password invalid
            </div>
          );
        } else {
          return (
            <div key={index} className="alert alert-danger">
              {err.message}
            </div>
          );
        }
      })}
      {/* {error && <div className="alert alert-danger">{error}</div>} */}
      <form onSubmit={submit} className="mt-5">
        {error.length > 0 ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          ""
        )}
        <label htmlFor="name"> Name</label>
        <input
          onChange={getUserData}
          type="text"
          className="form-control my-input mb-3"
          name="name"
        />
        <label htmlFor="age">email</label>
        <input
          onChange={getUserData}
          type="email"
          className="form-control my-input mb-3"
          name="email"
        />
        <label htmlFor="password">password</label>
        <input
          onChange={getUserData}
          type="password"
          className="form-control my-input mb-3"
          name="password"
        />
        <label htmlFor="password">RePassword</label>
        <input
          onChange={getUserData}
          type="password"
          className="form-control my-input mb-3"
          name="rePassword"
        />
        <label htmlFor="age">phone</label>
        <input
          onChange={getUserData}
          type="text"
          className="form-control my-input mb-3"
          name="phone"
        />

        <button type="submit" className="btn btn-info my-4">
          {isLoading == true ? (
            <i className="fas fa-spinner fa-spin "></i>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </>
  );
}
