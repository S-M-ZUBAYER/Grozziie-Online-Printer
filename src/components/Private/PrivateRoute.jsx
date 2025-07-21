import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { decodeJwt } from "jose";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user.accountUser);
  const location = useLocation();

  if (!user) {
    const token = localStorage.getItem("GrozziieToken");

    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        console.log(decodedToken);
        const { sub } = decodedToken;
        if (sub) {
          return children; // Assume 'sub' represents the user object or identifier
        } else {
          return <Navigate to="/login" state={{ from: location }} replace />;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  return children;
};

export default PrivateRoute;




// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { accountUserChange } from "../../features/slice/userSlice";

// const PrivateRoute = ({ children }) => {
//   const user = useSelector((state) => state.user.accountUser);
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);
//   // const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const dispatch = useDispatch();

//   console.log(loading, "check loading");

//   useEffect(() => {
//     const token = localStorage.getItem("GrozziieToken");
//     console.log(loading, "check loading");
//     if (!user) {
//       console.log(loading, "check loading", "!user");
//       if (token) {
//         const fetchUserDetails = async () => {
//           try {
//             const response = await axios.get(
//               "https://grozziieget.zjweiting.com:3091/GrozziiePrint-LoginRegistration/user/details",
//               {
//                 params: { token: token },
//               }
//             );
//             const { email } = response.data;
//             dispatch(accountUserChange(email));
//             setLoading(false);
//             return children;

//           } catch (error) {
//             console.error("Error fetching data:", error);
//             setLoading(false);
//           } finally {
//             setLoading(false);
//           }
//         };

//         fetchUserDetails();
//       } else {
//         setLoading(false);
//         // setIsAuthenticated(false);
//       }
//     }

//   }, []);

//   if (loading) {
//     return <p>Loading...</p>; // You can replace this with a loading spinner or any other loading indicator
//   }

//   // if (!isAuthenticated) {
//   //   return <Navigate to="/login" state={{ from: location }} replace />;
//   // }
//   setLoading(false);
//   return children;
// };

// export default PrivateRoute;

