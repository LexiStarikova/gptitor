import React, { useState } from 'react';
import './queryComponent.css'

type QueryComponentProps = {
  display_id: number;
  stored_id: number;
  queryText: string;
  onDelete: (display_id: number, stored_id: number) => void;
  onOpen: (stored_id: number) => void;
  isSelected: boolean;
  handleSelection: () => void;
  toMark: (stored_id: number) => void;
  isMarked: boolean;
  onEdit: (stored_id: number, newQueryText: string) => void;
};

const QueryComponent: React.FC<QueryComponentProps> = ({ display_id, stored_id, queryText, onDelete, onOpen, isSelected, handleSelection, onEdit, toMark, isMarked }) => {

  const toggleLike = () => {
    toMark(stored_id);
  };
  const [isEditing, setIsEditing] = useState(false);
  const [newQueryText, setNewQueryText] = useState(queryText);
  const handleEdit = () => {
    setIsEditing(true);
    setNewQueryText(queryText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQueryText(e.target.value);
  };

  const handleSave = () => {
    onEdit(stored_id, newQueryText);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };
  return (
    <div className={`query ${isSelected ? 'selected' : ''}`} onClick={handleSelection}>
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => onOpen(stored_id)}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 2.22949C4.68629 2.22949 2 4.91874 2 8.23244C2 11.5494 4.68894 14.2413 8.00591 14.2413H11C12.6569 14.2413 14 12.8982 14 11.2413V8.22949C14 4.91578 11.3137 2.22949 8 2.22949ZM5 7.56808C5 7.01579 5.44772 6.56808 6 6.56808H10C10.5523 6.56808 11 7.01579 11 7.56808C11 8.12036 10.5523 8.56808 10 8.56808H6C5.44772 8.56808 5 8.12036 5 7.56808ZM7 10.2374C7 9.68508 7.44772 9.23737 8 9.23737H10C10.5523 9.23737 11 9.68508 11 10.2374C11 10.7897 10.5523 11.2374 10 11.2374H8C7.44772 11.2374 7 10.7897 7 10.2374Z"
          fill="#3B4168"
        />
      </svg>
      {isEditing ? (
        <input
          type="text"
          value={newQueryText}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyPress={handleKeyPress}
          className={`queryname-input ${isEditing ? 'show' : ''}`}
          autoFocus
        />
      ) : (
        <p className='queryname'>
          {queryText}
        </p>
      )}
      <div className='actions'>
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className='deleteicon'
          onClick={() => onDelete(display_id, stored_id)}
        >
          <ellipse cx="8" cy="8.00786" rx="6" ry="6.00591" stroke="#3B4168" strokeWidth="2" />
          <path d="M12 12.0117L4 4.00384" stroke="#3B4168" strokeWidth="2" />
        </svg>
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleEdit}
        >
          <path d="M3.68273 8.91264C3.67007 8.92531 3.65704 8.93828 3.6437 8.95155C3.49168 9.1028 3.29925 9.29425 3.16252 9.53595C3.02579 9.77764 2.96082 10.0412 2.90949 10.2494C2.90483 10.2683 2.90028 10.2868 2.8958 10.3047L2.56522 11.6283C2.56242 11.6395 2.5595 11.6511 2.55649 11.6631C2.5197 11.8096 2.46875 12.0126 2.45122 12.1922C2.43105 12.3989 2.42447 12.8508 2.79333 13.2195L3.47434 12.5382L2.79333 13.2195C3.1622 13.5882 3.61415 13.5814 3.82084 13.5612C4.00045 13.5435 4.20335 13.4925 4.34983 13.4556C4.36183 13.4526 4.37346 13.4497 4.38466 13.4469L5.70525 13.1164C5.7232 13.1119 5.74166 13.1074 5.76057 13.1027C5.96897 13.0512 6.23276 12.9861 6.4746 12.849C6.71643 12.712 6.90788 12.5192 7.05912 12.3669C7.07273 12.3531 7.08602 12.3398 7.09898 12.3268C7.0991 12.3267 7.09922 12.3266 7.09933 12.3264L7.09934 12.3264L11.7086 7.71263L11.7086 7.71262C11.7096 7.71158 11.7107 7.71054 11.7117 7.7095C11.73 7.69122 11.7488 7.67252 11.7681 7.65342C11.9752 7.44761 12.2301 7.19443 12.3794 6.89241C12.6557 6.33368 12.6557 5.67807 12.3794 5.11934C12.2301 4.81732 11.9752 4.56414 11.7681 4.35833C11.7477 4.33814 11.7279 4.3184 11.7086 4.29912Z" stroke="#3B4168" strokeWidth="2" />
          <path d="M8.3335 5.00481L10.3335 3.67017L12.3335 5.67213L11.0002 7.6741L8.3335 5.00481Z" fill="#3B4168" />
        </svg>
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`likeicon ${isMarked ? 'liked' : ''}`}
          onClick={toggleLike}
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M2.5375 4.1417C3.13759 3.5412 3.95138 3.20386 4.7999 3.20386C5.64843 3.20386 6.46221 3.5412 7.0623 4.1417L7.9999 5.07942L8.9375 4.1417C9.23269 3.83577 9.58579 3.59175 9.97621 3.42387C10.3666 3.256 10.7865 3.16764 11.2114 3.16394C11.6363 3.16024 12.0577 3.24129 12.451 3.40235C12.8442 3.5634 13.2015 3.80125 13.502 4.102C13.8024 4.40275 14.04 4.76039 14.2009 5.15404C14.3618 5.5477 14.4428 5.96949 14.4391 6.3948C14.4354 6.82011 14.3471 7.24043 14.1794 7.63123C14.0117 8.02202 13.7679 8.37548 13.4623 8.67096L7.9999 14.1395L2.5375 8.67096C1.9376 8.07028 1.60059 7.25569 1.60059 6.40633C1.60059 5.55697 1.9376 4.74238 2.5375 4.1417V4.1417Z" stroke="#3B4168" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default QueryComponent;
