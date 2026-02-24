import React from 'react';
import { Link } from 'react-router-dom';
import './FollowListModal.css';

const FollowListModal = ({ isOpen, onClose, title, list }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {list.length > 0 ? (
                        <div className="follow-list">
                            {list.map((item, index) => {
                                const userId = item.follower_id || item.following_id;
                                const userName = item.follower_name || item.following_name;

                                return (
                                    <div key={index} className="follow-item">
                                        <Link to={`/user/${userId}`} className="follow-link" onClick={onClose}>
                                            <div className="follow-avatar">
                                                {userName ? userName[0] : '?'}
                                            </div>
                                            <span className="follow-name">{userName}</span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="empty-message">No {title.toLowerCase()} found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;
