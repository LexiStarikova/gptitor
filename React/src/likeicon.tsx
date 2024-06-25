import React from 'react';

type LikeIconProps = {
    liked: boolean;
    onClick: () => void;
};

const LikeIcon: React.FC<LikeIconProps> = ({ liked, onClick }) => {
    return (
        <div className={`likeicon ${liked ? 'liked' : ''}`} onClick={onClick}>
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.5375 4.1417C3.13759 3.5412 3.95138 3.20386 4.7999 3.20386C5.64843 3.20386 6.46221 3.5412 7.0623 4.1417L7.9999 5.07942L8.9375 4.1417C9.23269 3.83577 9.58579 3.59175 9.97621 3.42387C10.3666 3.256 10.7865 3.16764 11.2114 3.16394C11.6363 3.16024 12.0577 3.24129 12.451 3.40235C12.8442 3.5634 13.2015 3.80125 13.502 4.102C13.8024 4.40275 14.04 4.76039 14.2009 5.15404C14.3618 5.5477 14.4428 5.96949 14.4391 6.3948C14.4354 6.82011 14.3471 7.24043 14.1794 7.63123C14.0117 8.02202 13.7679 8.37548 13.4623 8.67096L7.9999 14.1395L2.5375 8.67096C1.9376 8.07028 1.60059 7.25569 1.60059 6.40633C1.60059 5.55697 1.9376 4.74238 2.5375 4.1417V4.1417Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        </div>
    );
};

export default LikeIcon;
