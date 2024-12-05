import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { LuLoader } from 'react-icons/lu';

const AccountInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('deliveryToken'); // Get token for the delivery partner
    if (!token) {
      router.push('/Delivery/deliverypartner'); // Redirect to login if no token is found
    } else {
      axios
        .get('/api/deliverypartners/user-info', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user); // Set user data
          setLoading(false); // Stop loading state
        })
        .catch(() => {
          localStorage.removeItem('deliveryToken');
          router.push('/Delivery/deliverypartner'); // Redirect to login on error
        });
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LuLoader className="animate-spin w-10 h-10 text-purple-800" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">Error: User not found</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-purple-800">Account Information</h2>
        <div className="text-left">
          <p className="mb-4">
            <span className="font-semibold text-gray-700">Name:</span> {user.name}
          </p>
          <p className="mb-4">
            <span className="font-semibold text-gray-700">Contact:</span> {user.contact}
          </p>
          <p className="mb-4">
            <span className="font-semibold text-gray-700">Area:</span> {user.area}
          </p>
          {/* Add more user info fields as needed */}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('deliveryToken');
            router.push('/Delivery/deliverypartner');
          }}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountInfo;


// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';

// const AccountInfo = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('deliveryToken');
//     if (!token) {
//       router.push('/Delivery/deliverypartner'); // Redirect to login if no token is found
//     } else {
//       axios
//         .get('/api/deliverypartners/user-info', {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setUser(res.data.user); // Set the user data
//           setLoading(false); // Stop loading
//         })
//         .catch(() => {
//           router.push('/Delivery/deliverypartner'); // Redirect to login on error
//         });
//     }
//   }, [router]);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <LuLoader className="animate-spin w-10 h-10 text-purple-800" />
// //       </div>
// //     );
// //   }

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-xl font-semibold text-red-600">Error: User not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
//         <h2 className="text-3xl font-bold mb-6 text-purple-800">Account Information</h2>
//         <div className="text-left">
//           <p className="mb-4">
//             <span className="font-semibold text-gray-700">Name:</span> {user.name}
//           </p>
//           <p className="mb-4">
//             <span className="font-semibold text-gray-700">Contact:</span> {user.contact}
//           </p>
//           <p className="mb-4">
//             <span className="font-semibold text-gray-700">Area:</span> {user.area}
//           </p>
//           {/* Add more user info as needed */}
//         </div>
//         <button
//           onClick={() => {
//             localStorage.removeItem('delivery');
//             router.push('/Delivery/deliverypartner');
//           }}
//           className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AccountInfo;
