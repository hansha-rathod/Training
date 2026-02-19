import { useParams } from "react-router-dom"
import './Profile.css';


function Profile() {
      const {profileId} = useParams();


    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-card">
                <div className="profile-header">
                    <h2>Profile Details</h2>
                    <p>Viewing user information below</p>
                </div>

                <div className="user-id-badge">
                    User ID: {profileId}
                </div>

                <div className="profile-info">
                    <div className="info-item">
                        <span className="info-label">Profile ID</span>
                        <span className="info-value">{profileId}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Status</span>
                        <span className="info-value">Active</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Member Since</span>
                        <span className="info-value">2024</span>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default Profile