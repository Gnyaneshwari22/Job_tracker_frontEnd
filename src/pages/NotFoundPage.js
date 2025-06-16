import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { FiAlertTriangle } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-700">
        <FiAlertTriangle className="text-yellow-500 text-6xl mb-4" />
        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-sm mb-6">
          The page you're looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
