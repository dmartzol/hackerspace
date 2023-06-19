import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout/PageLayout";

function Signup() {
  const formSchema = yup
    .object()
    .shape({
      firstname: yup.string().required(),
      lastname: yup.string().required(),
      email: yup
        .string()
        .lowercase()
        .email("must be a valid email")
        .required("email is required"),
      password: yup
        .string()
        .min(10, "password must have at least 10 characters")
        .required(),
      state: yup.string().lowercase().required(),
      city: yup.string().lowercase().required(),
      street_address: yup.string().lowercase().required(),
      dob: yup.date(),
      zip: yup
        .number()
        .test(
          "len",
          "must be exactly 5 characters",
          (val) => val.toString().length === 5
        )
        .required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      dob: "",
      zip: "",
      street_address: "",
      city: "",
    },
    resolver: yupResolver(formSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      await formSchema.validate(data, { abortEarly: false });
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await fetch(`/accounts`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("response not ok");
      }

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <PageLayout>
      <div className="lg:container lg:mx-auto lg:px-40 xl:px-80 px-4">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="andrew@example.com"
                        {...register("email")}
                      />
                    </div>
                    <p className=" text-red-600 text-sm">
                      {errors.email?.message}
                    </p>
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="password"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        {...register("password")}
                      />
                    </div>
                    <p className=" text-red-600 text-sm">
                      {errors.password?.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="date-of-birth"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Date of birth
                  </label>
                  <div className="mt-2">
                    <input
                      id="dob"
                      autoComplete="date-of-birth"
                      type="date"
                      name="dob"
                      min="1900-01-01"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("dob")}
                    />
                    <p className=" text-red-600 text-sm">
                      {errors.dob?.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first-name"
                      type="text"
                      name="first-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("firstname")}
                    />
                    <p className=" text-red-600 text-sm">
                      {errors.firstname?.message}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("lastname")}
                    />
                    <p className=" text-red-600 text-sm">
                      {errors.lastname?.message}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Country
                  </label>
                  <div className="mt-2">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Street address
                  </label>
                  <div className="mt-2">
                    <input
                      id="street-address"
                      type="text"
                      name="street-address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("street_address")}
                    />
                    <p className=" text-red-600 text-sm">
                      {errors.street_address?.message}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("city")}
                    />
                    <p className=" text-red-600 text-sm">
                      {errors.city?.message}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    State
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("state")}
                    />
                    <p className=" text-red-600 text-sm">
                      {errors.state?.message}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="zip"
                      id="zip"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register("zip")}
                    />
                    <p className=" text-red-600 text-sm">
                      {errors.zip?.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

export default Signup;
