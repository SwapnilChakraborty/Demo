import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isOwner = sessionStorage.getItem('ownerAuth') === 'true';
    if (!isOwner) {
        return <Navigate to="/owner-login" replace />;
    }
    return children;
}

export default ProtectedRoute;
