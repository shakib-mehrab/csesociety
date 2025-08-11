import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { Megaphone } from 'lucide-react';

const NoticeCard = ({ notice }) => {
  // Determine club/society label
  let clubLabel = '';
  if (notice.type === 'society') {
    clubLabel = 'Society Notice';
  } else if (notice.clubId && (notice.clubId.name || notice.clubId.clubName)) {
    clubLabel = notice.clubId.name || notice.clubId.clubName;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-[#6aa9d0]">
      <div className="p-6">
        <div className="flex items-center mb-2">
          <div className="bg-[#6aa9d0] p-2 rounded-full flex items-center justify-center">
            <Megaphone className="text-white" size={20} />
          </div>
          <p className="text-[#01457e] text-sm ml-3">Published on: {formatDate(notice.publishedAt)}</p>
        </div>
        {clubLabel && (
          <div className="mb-2 text-xs font-semibold text-[#004983] bg-[#c6daf9] px-2 py-1 rounded inline-block">
            {clubLabel}
          </div>
        )}
        <h3 className="text-2xl font-bold mb-3 text-[#002147]">{notice.title}</h3>
        <Link
          to={`/notices/${notice._id}`}
          className="font-semibold text-[#01457e] hover:text-[#004983] transition-colors duration-300"
        >
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
};

export default NoticeCard;
