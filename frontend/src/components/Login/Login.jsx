import React from "react";
import { CONTACT_EMAIL } from "../../config";
import PageLayout from "../PageLayout/PageLayout";

function Login() {
  return (
    <PageLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="title-font font-medium text-3xl text-gray-900">
              Please, log in to continue. If you are a new user,{" "}
              <a className="hover:underline text-blue-500" href="/signup">
                sign up
              </a>
              . If you have any questions or need help, please contact us at{" "}
              <a
                className="text-blue-500 border-b-4 border-blue-400 border-dashed"
                href={"mailto:" + CONTACT_EMAIL}
              >
                {CONTACT_EMAIL}
              </a>
              .
            </h1>
          </div>
          <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                type="text"
                id="full-name"
                name="full-name"
                placeholder="Your email address"
                defaultValue="andrew@example.com"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="password"
                className="leading-7 text-sm text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="email"
                name="email"
                defaultValue="password123"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Login
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Forgot your password?{" "}
              <a className="hover:underline text-blue-500" href="/forgot">
                Click here.
              </a>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default Login;
